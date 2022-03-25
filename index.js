const { app } = require("./src/app");
const config = require("./config");

const PORT = config.PORT;

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
