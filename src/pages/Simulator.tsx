import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatRupiah } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import Logo from "@/components/logo";

const FormSchema = z.object({
  monthlyIncome: z.string({
    message: "Penghasilan Per Bulan harus diisi!",
  }),
  pinjamanDiBankLain: z.string().optional().default("0"),
  jangkaWaktuKredit: z
    .string({
      required_error: "Masukan jangka waktu kredit anda.",
    })
    .min(1, "Jangka waktu kredit minimal 1 bulan."),
});

type SimulationFormValues = z.infer<typeof FormSchema>;

const defaultValues: Partial<SimulationFormValues> = {};

export default function Simulator() {
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [jangkaWaktuKredit, setJangkaWaktuKredit] = useState(0);
  const [sisaAngsuran, setSisaAngsuran] = useState(0);
  const [sukuBunga] = useState(0.0875); // 8.75% interest rate
  const [maxCredit, setMaxCredit] = useState(0);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // Parse form inputs
    const income = parseInt(data.monthlyIncome.replace(/\./g, "") || "0", 10);
    const otherLoans = parseInt(
      data.pinjamanDiBankLain.replace(/\./g, "") || "0",
      10
    );
    const period = parseInt(data.jangkaWaktuKredit || "0");

    setMonthlyIncome(income);
    setJangkaWaktuKredit(period);

    // Calculate Angsuran Per Bulan (50% of monthly income)
    const calculatedAngsuranPerBulan = income * 0.5;

    // Calculate Sisa Angsuran (Angsuran Per Bulan minus other bank loans)
    const calculatedSisaAngsuran = calculatedAngsuranPerBulan - otherLoans;
    setSisaAngsuran(calculatedSisaAngsuran);

    // Convert suku bunga to a monthly rate
    const monthlyRate = sukuBunga / 12;

    // Function to calculate Present Value (PV) similar to Excel's PV function
    const calculatePV = (
      rate: number,
      periods: number,
      payment: number
    ): number => {
      return (payment * (1 - Math.pow(1 + rate, -periods))) / rate;
    };

    // Calculate maximum credit using the correct PV formula
    const maxCreditValue = calculatePV(
      monthlyRate, // Monthly interest rate
      period, // Total payment periods in months
      calculatedSisaAngsuran // Negative payment as per the PV formula
    );

    // Update state with calculated max credit
    setMaxCredit(maxCreditValue);
  }

  return (
    <>
      <Card className="max-w-[1000px] mx-auto mt-10">
        <CardHeader>
          <div className="flex flex-row justify-between">
            <div>
              <CardTitle className="mb-2">Simulasi Angsuran</CardTitle>
              <CardDescription>
                Simulasi Angsuran eForm BNI FLEKSI AKTIF
              </CardDescription>
            </div>
            <Logo />
          </div>
          <Separator className="my-6" />
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-2 gap-10">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full md:pr-6 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="monthlyIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Penghasilan Per Bulan</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground text-sm">
                            Rp
                          </span>
                          <Input
                            className="pl-10"
                            placeholder="10.000.000"
                            type="text"
                            onInput={(e) => {
                              const value = e.currentTarget.value.replace(
                                /\D/g,
                                ""
                              );
                              const formattedValue = value.replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                "."
                              );
                              e.currentTarget.value = formattedValue;
                            }}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Masukkan penghasilan per bulan anda.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pinjamanDiBankLain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Angsuran di Bank lain</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground text-sm">
                            Rp
                          </span>
                          <Input
                            className="pl-10"
                            placeholder="1.500.000"
                            type="text"
                            onInput={(e) => {
                              const value = e.currentTarget.value.replace(
                                /\D/g,
                                ""
                              );
                              const formattedValue = value.replace(
                                /\B(?=(\d{3})+(?!\d))/g,
                                "."
                              );
                              e.currentTarget.value = formattedValue;
                            }}
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Masukkan angsuran di bank lain yang anda miliki.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jangkaWaktuKredit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jangka Waktu Kredit (Bulan)</FormLabel>
                      <FormControl>
                        <Input placeholder="24" type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Masukkan jangka waktu kredit.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Simulasi Perhitungan
                </Button>
              </form>
            </Form>
            <div>
              <div className="flex flex-col">
                <div className="flex-1 lg:max-w-2xl">
                  <div className="space-y-0.5 my-5">
                    <p className="text-muted-foreground">
                      Penghasilan Bersih Per Bulan
                    </p>
                    <h4 className="text-2xl font-bold tracking-tight">
                      {formatRupiah(monthlyIncome)}
                    </h4>
                  </div>
                </div>
                <div className="flex-1 lg:max-w-2xl">
                  <div className="space-y-0.5 my-5">
                    <p className="text-muted-foreground">Masa Kredit (bulan)</p>
                    <h4 className="text-2xl font-bold tracking-tight">
                      {jangkaWaktuKredit}
                    </h4>
                  </div>
                </div>
                <div className="flex-1 lg:max-w-2xl">
                  <div className="space-y-0.5 my-5">
                    <p className="text-muted-foreground">Net Angsuran</p>
                    <h4 className="text-2xl font-bold tracking-tight">
                      {formatRupiah(sisaAngsuran)}
                    </h4>
                  </div>
                </div>
                <div className="flex-1 lg:max-w-2xl">
                  <div className="space-y-0.5 my-5">
                    <p className="text-muted-foreground">Maks. Kredit</p>
                    <h4 className="text-2xl font-bold tracking-tight">
                      {formatRupiah(maxCredit)}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
