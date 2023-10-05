import axios from "axios";
const client = axios.create({
  baseURL: "/api/v1",
});

export async function fetchBanksByCountry(options) {
  const { data } = await client.get("/banks", { params: options });
  return data.data.banks;
}

export async function fetchCurrencies() {
  const response = await client.get("/currencies");
  return response.data.data.currencies;
}

export async function resolveBankAccount(payload) {
  const { data } = await client.post("/banks/resolve", payload);

  return {
    accountName: data.data.account.account_name,
    accountNumber: data.data.account.account_number,
  };
}

export async function getUserPage() {
  const { data } = await client.get("/me/page");
  return data.data.page;
}

export async function getUser() {
  const { data } = await client.get("/me");
  return data.data.user;
}

export async function checkSlugAvailability(slug) {
  const acceptedStatusCodes = [204, 404];

  const response = await client.get(`/pages/${slug}/availability`, {
    validateStatus: (status) => acceptedStatusCodes.includes(status),
  });

  if (response.status === 404) {
    return false;
  }

  return true;
}

export async function createPage(payload) {
  const { data } = await client.post("/me/page", payload, {
    headers: {
      "Content-Type": "'multipart/form-data'",
    },
  });
  return data.data.page;
}

export async function editPage(payload) {
  const { data } = await client.patch("/me/page", payload, {
    headers: {
      "Content-Type": "'multipart/form-data'",
    },
  });
  return data.data.page;
}

export async function connectWithdrawalAccount(payload) {
  await client.put("/me/withdrawal-account", payload);
}

export async function getPageBySlug(slug) {
  const { data } = await client.get(`/pages/${slug}`);
  return data.data.page;
}

export async function createTip(slug, payload) {
  const { data } = await client.post(`/pages/${slug}/tips`, payload);
  return data.data.paymentLink;
}
