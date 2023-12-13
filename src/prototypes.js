Number.prototype.toReal = function () {
  return this.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 5,
  });
};

Number.prototype.to2digits = function () {
  return parseFloat(this.toFixed(2))
};

String.prototype.toReal = function () {
  return parseFloat(this).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 5,
  });
};

String.prototype.toCellphone = function () {
  return this.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};

String.prototype.toPhone = function () {
  return this.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
};

String.prototype.toCnpj = function () {
  return this.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
};
String.prototype.toDateBr = function () {
  return this.split('-').reverse().join('/');
};
