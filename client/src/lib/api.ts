import { type InsertContactRequest } from "@shared/schema";

export async function submitContactRequest(data: InsertContactRequest) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Ein Fehler ist aufgetreten");
  }

  return response.json();
}
