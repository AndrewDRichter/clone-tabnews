function status(request, response) {
  response.status(200).json({ message: "Testando endpoint /status" });
}

export default status;
