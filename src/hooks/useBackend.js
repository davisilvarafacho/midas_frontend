import { backend } from "services/backend";
import { obj2Filter } from "utils/obj2filter";

export function useBackend(defaultEndpoint) {
  /**
   *
   * @param {*} filtros
   * @param {*} endpoint
   * @returns
   */
  async function listarRegistros(filtros = {}, endpoint = defaultEndpoint) {
    const uri = endpoint + "?" + obj2Filter(filtros);
    const response = await backend.get(uri);

    let dadosResposta = null;
    if (response.data) dadosResposta = { ...response.data, $status: response.status };
    else dadosResposta = { $status: response.status };

    return dadosResposta;
  }

  /**
   *
   * @param {*} id
   * @param {*} endpoint
   * @returns
   */
  async function obterRegistro(id, endpoint = defaultEndpoint) {
    const response = await backend.get(endpoint + id + "/");

    let dadosResposta = null;
    if (response.data)
      dadosResposta = { ...response.data, $status: response.status };
    else dadosResposta = { $status: response.status };

    return dadosResposta;
  }

  /**
   *
   * @param {*} filtros
   * @param {*} endpoint
   * @returns
   */
  async function obterRegistroPorFiltragem(
    filtros = {},
    endpoint = defaultEndpoint
  ) {
    const uri = endpoint + "?" + obj2Filter(filtros);
    const response = await backend.get(uri);

    let dadosResposta = null;
    if (response.data)
      dadosResposta = { ...response.data, $status: response.status };
    else dadosResposta = { $status: response.status };

    return dadosResposta.resultados[0] ?? null;
  }

  /**
   *
   * @param {*} dados
   * @param {'post' | 'patch' | 'put'} method
   * @param {*} id
   * @param {*} endpoint
   * @returns
   */
  async function salvarRegistro(
    dados = {},
    method = "post",
    id = null,
    endpoint = defaultEndpoint
  ) {
    const uri = id ? endpoint + id + "/" : endpoint;
    const response = await backend[method.toLowerCase()](uri, dados);

    let dadosResposta = null;
    if (response.data)
      dadosResposta = { ...response.data, $status: response.status };
    else dadosResposta = { $status: response.status };

    return dadosResposta;
  }

  /**
   *
   * @param {*} id
   * @param {*} endpoint
   * @returns
   */
  async function excluirRegistro(id, endpoint = defaultEndpoint) {
    const response = await backend.delete(endpoint + id + "/");
    return response.data;
  }

  return {
    listarRegistros,
    obterRegistro,
    obterRegistroPorFiltragem,
    salvarRegistro,
    excluirRegistro,
  };
}