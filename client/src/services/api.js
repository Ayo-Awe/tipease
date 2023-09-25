import axios from "axios";
const client = axios.create({
  baseURL: "/api/v1",
});

export async function fetchBanksByCountry(country = "nigeria") {
  const { data } = await client.get("/banks", { params: { country } });
  return data.data.banks;
}

export async function fetchCurrencies() {
  const response = await client.get("/currencies");
  return response.data.data.currencies;
}
