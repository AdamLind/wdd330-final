export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;

}

export async function loadHeader() {
  // Load the header template in from the partials using the loadTemplate.
  const headerTemplate = await loadTemplate("../../public/partials/header.html");
  //Grab the header placeholder element out of the DOM
  const headerElement = document.querySelector("#header");
  // Render the header using renderWithTemplate
  renderWithTemplate(headerTemplate, headerElement, null);
}
