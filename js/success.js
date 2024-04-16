// CREATE SUCCESS PAGE
const successMessage = document.createElement("div");
successMessage.innerHTML = "<h1>Report Successfully Created</h1>";
successMessage.style.textAlign = "center";
successMessage.style.fontSize = "24px";
successMessage.style.marginBottom = "24px";

const reportIdTitle = document.createElement("h2");
reportIdTitle.innerText = "Report ID";
reportIdTitle.style.fontSize = "16px";
reportIdTitle.style.marginBottom = "16px";

const reportId = document.createElement("p");
reportId.innerText = "------ FETCH ID FROM REPORT ------";
reportId.style.fontSize = "16px";
reportId.style.marginBottom = "16px";

const successIconContainer = document.createElement("div");
successIconContainer.style.position = "relative";

const successIcon = document.createElement("div");
successIcon.style.clipPath = "circle(50% at 50% 50%)";
successIcon.style.height = "200px";
successIcon.style.width = "200px";
successIcon.style.backgroundColor = "#2D7A50";
successIcon.style.margin = "40px auto";
successIcon.style.position = "absolute";
successIcon.style.top = "50%";
successIcon.style.left = "50%";
successIcon.style.transform = "translate(-50%)";

const successCheck = document.createElement("div");
successCheck.style.clipPath = "polygon(25% 45%, 18% 52%, 40% 76%, 81% 39%, 74% 31%, 40% 61%)";
successCheck.style.height = "200px";
successCheck.style.width = "200px";
successCheck.style.margin = "40px auto";
successCheck.style.backgroundColor = "white";
successCheck.style.position = "absolute";
successCheck.style.top = "50%";
successCheck.style.left = "50%";
successCheck.style.transform = "translate(-50%)";

document.body.appendChild(successMessage);
successMessage.appendChild(reportIdTitle);
successMessage.appendChild(reportId);
successMessage.appendChild(successIconContainer);
successIconContainer.appendChild(successIcon);
successIconContainer.appendChild(successCheck);