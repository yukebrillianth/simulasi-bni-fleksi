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
import { Separator } from "./components/ui/separator";
import { formatRupiah } from "./lib/utils";
import { useState } from "react";
import { Input } from "./components/ui/input";

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

function Logo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="max-w-[150px]"
      version="1.1"
      viewBox="0 0 52.917 15.328"
    >
      <defs>
        <clipPath clipPathUnits="userSpaceOnUse">
          <path d="M0 0h595.276v841.89H0z"></path>
        </clipPath>
        <clipPath clipPathUnits="userSpaceOnUse">
          <path d="M0 0h595.276v841.89H0z"></path>
        </clipPath>
        <clipPath clipPathUnits="userSpaceOnUse">
          <path d="M0 0h595.276v841.89H0z"></path>
        </clipPath>
        <clipPath clipPathUnits="userSpaceOnUse">
          <path d="M0 0h595.276v841.89H0z"></path>
        </clipPath>
        <clipPath clipPathUnits="userSpaceOnUse">
          <path d="M0 0h595.276v841.89H0z"></path>
        </clipPath>
      </defs>
      <g
        fillOpacity="1"
        fillRule="nonzero"
        stroke="none"
        transform="translate(0 -220.363)"
      >
        <path
          fill="#fff"
          strokeWidth="0.053"
          d="M14.507 234.87H0v-14.507h14.507z"
        ></path>
        <path
          fill="#f15a22"
          strokeWidth="0.356"
          d="M5.834 230.155l1.546-1.248c-.26-.326-.505-.654-.737-.993-1.789-2.588-2.849-5.221-2.083-7.551H0v2.515z"
        ></path>
        <path
          fill="#f15a22"
          strokeWidth="0.356"
          d="M8.272 226.394c.097-.821.346-2.37 1.853-3.521 1.304-.993 2.937-1.184 4.382-.57v-1.94H6.458c-.53 2.36.864 4.954 1.814 6.031"
        ></path>
        <path
          fill="#f15a22"
          strokeWidth="0.356"
          d="M10.225 224.027l-.006.004c-1.515 1.231-1.142 3.163.268 4.895 1.086 1.337 2.54 2.275 4.02 1.564v-5.704c-1.33-1.362-2.927-1.861-4.282-.759"
        ></path>
        <path
          fill="#f15a22"
          strokeWidth="0.356"
          d="M0 225.852v9.017h.002l4.39-3.55z"
        ></path>
        <path
          fill="#f15a22"
          strokeWidth="0.356"
          d="M7.983 229.622c-.431.354-.964.788-1.555 1.27l.57.71c.825 1.031 2.031 2.818 3.525 2.334l.055.068-1.061.865h4.99v-3.43c-2.567 1.395-4.775.125-6.524-1.817"
        ></path>
        <path
          fill="#f15a22"
          strokeWidth="0.356"
          d="M5.574 232.793l-.59-.735a975.223 975.223 0 01-3.515 2.811h5.584c-.363-.77-1.022-1.506-1.479-2.076"
        ></path>
        <path
          fill="#006885"
          strokeWidth="0.356"
          d="M26.59 226.423c1.337-.234 2.207-1.388 2.207-2.862 0-1.963-1.699-3.198-4.607-3.198h-5.754v.067c1.175.644 1.148 1.685 1.148 2.679v8.993c0 1.011.027 2.062-1.148 2.697v.065h2.77c2.708 0 4.785.046 6.334-.682 1.647-.774 2.644-2.162 2.644-3.855 0-2.161-1.608-3.487-3.594-3.904m-4.749-4.722l1.822.03c1.35 0 2.731.66 2.731 2.182 0 1.807-1.222 2.29-2.963 2.29l-1.59.003v-.002zm1.756 11.673l-1.756.002v-5.798l1.888-.01c2.196 0 4.01.816 4.01 2.955 0 2.094-1.904 2.85-4.142 2.85"
        ></path>
        <path
          fill="#006885"
          strokeWidth="0.356"
          d="M34.596 232.103c0 1.237-.022 2.115 1.146 2.802v.063h-3.9v-.063c1.166-.687 1.146-1.565 1.146-2.802v-8.812c0-1.228.02-2.202-1.145-2.86v-.068h3.238v.022c.086.263.23.41.33.553.103.137.307.438.307.438l7.429 10.012v-8.183c0-1.234.02-2.116-1.145-2.774v-.068h3.877v.068c-1.145.658-1.145 1.54-1.145 2.774v12.485c-.708-.28-2.683-1.925-4.09-3.817-2.524-3.39-6.048-8.105-6.048-8.105z"
        ></path>
        <path
          fill="#006885"
          strokeWidth="0.356"
          d="M49.496 222.992c0-1.014-.017-1.917-1.144-2.561v-.068h4.565v.068c-1.131.624-1.141 1.567-1.141 2.56v9.27c0 .99-.027 1.994 1.14 2.64v.065h-4.564v-.066c1.174-.654 1.144-1.64 1.144-2.633z"
        ></path>
      </g>
    </svg>
  );
}

function App() {
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

export default App;
