import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  ArcElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";
import { FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";

import { useBackend } from "hooks/useBackend";
import { endpoints } from "constants/endpoints";

ChartJS.register(
  CategoryScale,
  PointElement,
  LinearScale,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function Navbar() {
  return (
    <div id="Navbar" className="w-full bg-black pt-3 pb-2 px-4">
      <h1 className="text-xl font-bold">Gerenciador do rafachera</h1>
    </div>
  );
}

export function GastosCategoriasPieChart() {
  const [labels, setLabels] = useState([]);
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [dadosTratados, setDadosTratados] = useState([]);

  const { listarRegistros } = useBackend(
    endpoints.dashboards.gastosPorCategoria
  );
  const { data } = useQuery(
    [endpoints.dashboards.gastosPorDia, "data_gasto__month=" + mes],
    () =>
      listarRegistros({
        data_gasto__month: mes,
      })
  );

  useEffect(() => {
    if (!data) return;

    setLabels(data.resultados.map((item) => item.categoria__nome));
    setDadosTratados(data.resultados.map((item) => item.total));
  }, [data]);

  const dadosChart = {
    labels,
    datasets: [
      {
        label: "Divisão dos gastos",
        data: dadosTratados,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full">
      <Pie data={dadosChart} />
    </div>
  );
}

export function GastorPorDiaLineChart() {
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [labels, setLabels] = useState([]);
  const [dadosTratados, setDadosTratados] = useState([]);

  const { listarRegistros } = useBackend(endpoints.dashboards.gastosPorDia);
  const { data } = useQuery(
    [endpoints.dashboards.gastosPorDia, "data_gasto__month=" + mes],
    () =>
      listarRegistros({
        data_gasto__month: mes,
      })
  );

  useEffect(() => {
    return;
    if (!data) return;

    setLabels(data.resultados.map((item) => item.data.split("-")[2]));
    setDadosTratados(data.resultados.map((item) => item.total));
  }, [data]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Resumo finançeiro",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            var label = context.dataset.label || "";

            if (label) {
              label += ": ";
            }
            label += new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(context.parsed.y);
            return label;
          },
        },
      },
    },
  };

  const dadosChart = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Dinheiro gasto",
        data: dadosTratados,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return <Line options={options} data={dadosChart} />;
}

export function EspectativaVsRealidadeGastosDoubleBarChart() {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Espectativa x Realidade Gastos",
      },
    },
  };

  const labels = ["Investimentos", "Lazer", "Despesas", "Economia"];
  /*
    ================
    # 2500 - total #
    ================

    800 - despesas
    200 - investimentos
    1000 - guardar
    500 - lazer
  */

  const data = {
    labels,
    datasets: [
      {
        label: "Expectativa",
        data: Array.from({ length: 4 }, (_, index) => index + 1),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Realidade",
        data: Array.from({ length: 4 }, (_, index) => index + 1),
        backgroundColor: "rgba(125, 15, 132, 0.5)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
}

export function BarraGastosLazer(props) {
  // eslint-disable-next-line react/prop-types
  const { totalGasto = 0 } = props;

  const [porcentagem, setPorcentagem] = useState(0);

  useEffect(() => {
    setPorcentagem(totalGasto > 500 ? 100 : (totalGasto / 500) * 100);
  }, [totalGasto]);

  return (
    <div className="w-full">
      <div className="flex justify-between text-gray-600">
        <h6>{totalGasto.toReal()}</h6>
        <h6>R$ 500,00</h6>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 mt-2">
        <div
          className="bg-blue-600 h-3 rounded-full"
          style={{ width: `${porcentagem}%` }}
        />
      </div>
    </div>
  );
}

export function Kpis() {
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [dados, setDados] = useState({});

  const { listarRegistros } = useBackend(endpoints.dashboards.kpis);
  const { data, isSuccess } = useQuery(
    [endpoints.dashboards.kpis, "data_gasto__month=" + mes],
    () =>
      listarRegistros({
        data_gasto__month: mes,
      })
  );

  useEffect(() => {
    if (!data) return;

    const dadosTratados = {};
    for (const item of data.resultados) dadosTratados[item.origem] = item.total;

    setDados(dadosTratados);
  }, [data]);

  return (
    <div id="kpis" className="text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {/* fazer um degrade com o bg */}
        <div className="bg-rose-600 rounded-lg shadow-lg p-4">
          <h6 className="text-sm">Despesas</h6>
          <h4 className="text-2xl font-bold">{(dados.DES ?? 0).toReal()}</h4>
        </div>

        {/* fazer um degrade com o bg */}
        <div className="bg-emerald-600 rounded-lg shadow-lg p-4">
          <h6 className="text-sm">Economia</h6>
          <h4 className="text-2xl font-bold">{(dados.ECO ?? 0).toReal()}</h4>
        </div>

        {/* fazer um degrade com o bg */}
        <div className="bg-sky-500 rounded-lg shadow-lg p-4">
          <h6 className="text-sm">Investimentos</h6>
          <h4 className="text-2xl font-bold">{(dados.INV ?? 0).toReal()}</h4>
        </div>

        {/* fazer um degrade com o bg */}
        <div className="bg-amber-500 rounded-lg shadow-lg p-4">
          <h6 className="text-sm">Lazer</h6>
          <h4 className="text-2xl font-bold">{(dados.LAZ ?? 0).toReal()}</h4>
        </div>
      </div>
    </div>
  );
}

export function ContentDespesasLazer() {
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [totalDespesas, setTotalDespesas] = useState(0);

  const [gastoSugeridoDia, setGastoSugeridoDia] = useState(0);

  const { listarRegistros } = useBackend(endpoints.despesas);
  const { data } = useQuery(
    [endpoints.despesas, "data_gasto__month=" + mes],
    () =>
      listarRegistros({
        data_gasto__month: mes,
        limit: 1000,
      })
  );

  useEffect(() => {
    if (!data) return;

    setTotalDespesas(
      data.resultados.reduce((acc, item) => acc + item.valor_total, 0)
    );
  }, [data]);

  function getDiasFaltantesFimMes() {
    const today = new Date();
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );
    const remainingDays = lastDayOfMonth.getDate() - today.getDate();

    return remainingDays;
  }

  useEffect(() => {
    const diferenca = 500 - totalDespesas;
    const mediaGastoPorDia = (diferenca / getDiasFaltantesFimMes()).to2digits();
    setGastoSugeridoDia(mediaGastoPorDia > 0 ? mediaGastoPorDia : 0);
  }, [totalDespesas]);

  return (
    <div className="mb-6">
      <BarraGastosLazer totalGasto={totalDespesas} />
      <p className="text-gray-600 text-end mt-2">
        Gasto diário sugerido: {gastoSugeridoDia.toReal()}
      </p>
    </div>
  );
}

export function HistoricoDespesas() {
  const [mes, setMes] = useState(new Date().getMonth() + 1);

  const [entradas, setEntradas] = useState([]);

  const { listarRegistros } = useBackend(endpoints.despesas);
  const { data, isLoading, isSuccess } = useQuery(
    [endpoints.despesas, "data_gasto__month=" + mes],
    () =>
      listarRegistros({
        data_gasto__month: mes,
        limit: 1000,
      })
  );

  return (
    <div id="historico-gastos">
      <div className="flex justify-between">
        <h5 className="text-xl">Histórico</h5>

        <select className="px-3 py-1 rounded-lg outline-none">
          <option value="">Todos</option>
          <option value="">Salário 12/2023</option>
          <option value="">Salário 11/2023</option>
          <option value="">Salário 10/2023</option>
          <option value="">Salário 09/2023</option>
        </select>
      </div>

      <div id="lista-gastos">
        {isLoading ? <p>Carregando...</p> : null}

        {isSuccess
          ? data.resultados.map((despesa) => (
              <div
                key={despesa.id}
                className="w-full rounded-2xl shadow-md bg-gray-50 py-2 ps-4 pe-4 mt-4"
              >
                <div className="grid grid-cols-5 text-gray-800">
                  <span className="flex items-center">
                    <FaArrowDownLong className="text-rose-600 me-4" />
                    {despesa.descricao}
                  </span>
                  <span className="text-center">
                    {despesa.data_gasto.toDateBr()}
                  </span>
                  <span className="text-center">Salário 12/2023</span>
                  <span className="text-center">
                    Parcela {despesa.parcela || "1"} de{" "}
                    {despesa.total_parcelas || "1"}
                  </span>
                  <span className="text-end">{despesa.valor_total.toReal()}</span>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export function App() {
  return (
    <div className="w-screen">
      <Navbar />

      <div id="content" className="container mx-auto pt-6">
        <div id="intro" className="flex justify-between">
          <h4 className="text-xl">Seja bem vindo de volta, Rafacho!</h4>
          <select className="px-3 py-1 rounded-lg outline-none">
            <option value="">Mensal</option>
            <option value="">Anual</option>
          </select>
        </div>

        <Kpis />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mt-7">
          <div id="gastos-categorias">
            <GastosCategoriasPieChart />
          </div>

          <div id="gastos-diarios" className="hidden">
            <GastorPorDiaLineChart />
          </div>

          <div className="col-span-3 mt-6">
            <ContentDespesasLazer />

            <HistoricoDespesas />
          </div>
        </div>
      </div>
    </div>
  );
}
