import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm, useFieldArray } from "react-hook-form";
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
  pinjamanDiBankLain: z.array(
    z.object({
      amount: z.string().default("0"),
      sisaTenor: z.string().default("0"),
      sisaHutang: z.string().default("0"),
    })
  ),
  jangkaWaktuKredit: z
    .string({
      required_error: "Masukan jangka waktu kredit anda.",
    })
    .min(1, "Jangka waktu kredit minimal 1 bulan."),
});

type SimulationFormValues = z.infer<typeof FormSchema>;

const defaultValues: Partial<SimulationFormValues> = {};

export default function NewSimulator() {
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [jangkaWaktuKredit, setJangkaWaktuKredit] = useState(0);
  const [sukuBunga] = useState(0.0875); // 8.75% interest rate
  const [maxCredit, setMaxCredit] = useState(0);
  const [sumOfAngsuranBulanan, setSumOfAngsuranBulanan] = useState(0);
  const [sumOfSisaHutang, setSumOfSisaHutang] = useState(0);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pinjamanDiBankLain",
  });

  const calculateTotalAngsuran = () => {
    const total = form.getValues().pinjamanDiBankLain.reduce((acc, curr) => {
      return acc + parseInt(curr.amount.replace(/\./g, "") || "0", 10);
    }, 0);
    setSumOfAngsuranBulanan(total);
  };

  const calculateTotalSisaHutang = () => {
    const total = form.getValues().pinjamanDiBankLain.reduce((acc, curr) => {
      const angsuran = parseInt(curr.amount.replace(/\./g, "") || "0", 10);
      const tenor = parseInt(curr.sisaTenor || "0", 10);
      const sisaHutang = angsuran * tenor;
      return acc + sisaHutang;
    }, 0);
    console.log(total);
    setSumOfSisaHutang(total);
  };

  const calculateSisaHutang = (angsuranPerBulan: string, sisaTenor: string) => {
    const calculatedVal =
      parseInt(angsuranPerBulan.replace(/\./g, "") || "0", 10) *
      parseInt(sisaTenor);
    const formattedValue = calculatedVal
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return formattedValue || 0;
  };

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const income = parseInt(data.monthlyIncome.replace(/\./g, "") || "0", 10);
    const period = parseInt(data.jangkaWaktuKredit || "0");

    setMonthlyIncome(income);
    setJangkaWaktuKredit(period);

    const calculatePV = (
      sukuBunga: number,
      jangkaWaktuKredit: number,
      angsuranBulanan: number
    ): number => {
      // PV = (angsuranBulanan * (1 - (1 + sukuBunga / 12)^-jangkaWaktuKredit)) / (sukuBunga / 12)
      const bungaBulanan = sukuBunga / 12;
      const pv =
        (angsuranBulanan *
          (1 - Math.pow(1 + bungaBulanan, -jangkaWaktuKredit))) /
        bungaBulanan;
      return pv;
    };
    const calc = calculatePV(sukuBunga, period, income * 0.6);
    console.log(sukuBunga, period);
    console.log(calc);
    setMaxCredit(calc);
  }

  return (
    <>
      <Card className="max-w-[1000px] mx-auto mt-10 mb-10">
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
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full md:pr-6 space-y-6"
            >
              <div className="grid lg:grid-cols-2 gap-10">
                <div className="col-span-2">
                  <h4 className="text-xl mb-4">Simulasi Angsuran Lainnya</h4>
                  {fields.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-4 mb-4">
                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name={`pinjamanDiBankLain.${index}.amount`}
                          render={({ field }) => (
                            <FormItem className="grid gap-3">
                              <FormLabel>Angsuran/Bulan (Rp)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground text-sm">
                                    Rp
                                  </span>
                                  <Input
                                    className="pl-10"
                                    placeholder="1.500.000"
                                    type="text"
                                    onKeyUp={() => {
                                      calculateTotalAngsuran();
                                      calculateTotalSisaHutang();
                                    }}
                                    onInput={(e) => {
                                      const value =
                                        e.currentTarget.value.replace(
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
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`pinjamanDiBankLain.${index}.sisaTenor`}
                          render={({ field }) => (
                            <FormItem className="grid gap-3">
                              <FormLabel>Sisa Tenor (bulan)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="12"
                                  type="text"
                                  onKeyUp={() => calculateTotalSisaHutang()}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`pinjamanDiBankLain.${index}.sisaHutang`}
                          render={() => (
                            <FormItem className="grid gap-3">
                              <FormLabel>Sisa Hutang (Rp)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground text-sm">
                                    Rp
                                  </span>
                                  <Input
                                    className="pl-10 disabled:opacity-100"
                                    placeholder="1.500.000"
                                    type="text"
                                    disabled
                                    value={calculateSisaHutang(
                                      form.getValues().pinjamanDiBankLain[index]
                                        .amount,
                                      form.getValues().pinjamanDiBankLain[index]
                                        .sisaTenor
                                    )}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={() => remove(index)}
                        variant={"destructive"}
                      >
                        Hapus
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() =>
                      append({ amount: "", sisaTenor: "", sisaHutang: "" })
                    }
                    variant={"secondary"}
                  >
                    Tambah Pinjaman Lain
                  </Button>
                </div>
                <div className="col-span-2">
                  <h4 className="text-xl text-blue-900 font-bold">
                    Dengan Pinjaman Lainnya
                  </h4>
                  <div className="flex flex-col lg:flex-row mb-4">
                    <div className="flex-1 lg:max-w-2xl">
                      <div className="space-y-0.5 my-5">
                        <p className="text-muted-foreground">
                          Total Angsuran/Bulan
                        </p>
                        <h4 className="text-2xl font-bold tracking-tight">
                          {formatRupiah(sumOfAngsuranBulanan)}
                        </h4>
                      </div>
                    </div>
                    <div className="flex-1 lg:max-w-2xl">
                      <div className="space-y-0.5 my-5">
                        <p className="text-muted-foreground">
                          Total Sisa Hutang
                        </p>
                        <h4 className="text-2xl font-bold tracking-tight">
                          {formatRupiah(sumOfSisaHutang)}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-xl text-orange-600 font-bold">
                    Dengan BNI Fleksi
                  </h4>
                  <div className="flex flex-col lg:flex-row">
                    <div className="flex-1 lg:max-w-2xl">
                      <div className="space-y-0.5 my-5">
                        <p className="text-muted-foreground">
                          Angsuran Per Bulan
                        </p>
                        <h4 className="text-2xl font-bold tracking-tight">
                          {formatRupiah(
                            (+(sukuBunga / 12) /
                              (1 -
                                Math.pow(
                                  1 + sukuBunga / 12,
                                  -jangkaWaktuKredit
                                ))) *
                              (sumOfSisaHutang * 1) || 0
                          )}
                        </h4>
                      </div>
                    </div>
                    <div className="flex-1 lg:max-w-2xl">
                      <div className="space-y-0.5 my-5">
                        <p className="text-muted-foreground">
                          Nominal Pinjaman
                        </p>
                        <h4 className="text-2xl font-bold tracking-tight">
                          {formatRupiah(sumOfSisaHutang)}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
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
                  className="bg-orange-600 hover:bg-orange-700 col-span-2"
                >
                  Simulasi Perhitungan
                </Button>

                <div className="col-span-2">
                  <div className="flex flex-col lg:flex-row">
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
                        <p className="text-muted-foreground">
                          Masa Kredit (bulan)
                        </p>
                        <h4 className="text-2xl font-bold tracking-tight">
                          {jangkaWaktuKredit}
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row">
                    <div className="flex-1 lg:max-w-2xl">
                      <div className="space-y-0.5 my-5">
                        <p className="text-muted-foreground">
                          Angsuran Per Bulan (DSR 60%)
                        </p>
                        <h4 className="text-2xl font-bold tracking-tight">
                          {formatRupiah(monthlyIncome * 0.6)}
                        </h4>
                      </div>
                    </div>
                    <div className="flex-1 lg:max-w-2xl">
                      <div className="space-y-0.5 my-5">
                        <p className="text-muted-foreground">
                          Maksimal Kredit yang Diajukan
                        </p>
                        <h4 className="text-2xl font-bold tracking-tight">
                          {formatRupiah(maxCredit)}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
