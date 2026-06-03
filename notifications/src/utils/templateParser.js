export function parseTemplate(template, data) {
  return template.replace(/\{\{(.*?)\}\}/g, (_, key) => {
    return data[key.trim()] || "";
  });
}


//Example template

// Hello {{customerName}}
// Your order from {{shopName}} is confirmed.
// Total: ₹{{amount}}