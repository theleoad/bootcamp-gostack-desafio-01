const express = require("express");
const server = express();

server.use(express.json());

let numberOfProjects = 0;
const projects = [];

/*
  Middleware para contar o número de requisições
*/

server.use((req, res, next) => {
  numberOfProjects += 1;
  console.log("Número de requisições:", numberOfProjects);

  next();
});

/*
  Middleware para checar se ID do projeto existe
*/
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(proj => proj.id === id);

  if (!project) {
    return res.status(400).json({ error: "ID inexistente" });
  }

  return next();
}

/*
  Método Post para criar projeto
*/
server.post("/projects/", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

/*
  Método Post para criar tarefa dentro do proejto fornecido por ID
*/
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { task } = req.body;

  const project = projects.find(proj => proj.id === id);

  project.tasks.push(task);

  return res.json(project);
});

/*
  Método Get para listar projetos
*/
server.get("/projects", (req, res) => {
  return res.json(projects);
});

/*
  Método Get para listar projeto com ID fornecida
*/
server.get("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const project = projects.find(proj => proj.id === id);

  return res.json(project);
});

/*
  Método Put para alterar título do projeto com ID fornecida
*/
server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(proj => proj.id === id);

  project.title = title;

  return res.json(projects);
});

/*
  Método Delete para apagar projeto com ID fornecida
*/
server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectId = projects.find(proj => proj.id === id);

  projects.splice(projectId, 1);

  return res.send();
});

server.listen(3500);
