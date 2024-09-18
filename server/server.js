const express = require("express");
const path = require("path");
const fs = require("fs-extra");
const fileUpload = require("express-fileupload");
const { MongoClient } = require("mongodb");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();
const port = 5000;

app.use(cookieParser());
app.use(fileUpload());

const url = process.env.URL || "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

async function connectToMongoDB() {
  await client.connect();
}

connectToMongoDB();
const db = client.db("system");
const col = db.collection("users");
const aktaDb = db.collection("akta");
const aktaUsersDb = db.collection("aktaUsers");

app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/dist")));
app.use(express.static(__dirname + "/public"));

const secretKey = process.env.SECRET_KEY;
const secretKey2 = process.env.SECRET_KEY2;
app.use(cookieParser(secretKey));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

app.post("/login", async (req, res) => {
  if (req.cookies.user == undefined || req.cookies.user == null) {
    const { login, password } = req.body;
    const data = await col.findOne({ login: login, haslo: password });

    if (data != null) {
      res.cookie("imie", data.imie);
      res.cookie("nazwisko", data.nazwisko);
      res.cookie("user", secretKey + data.login + secretKey2);
      res.status(200);

      const userData = {
        imie: data.imie,
        nazwisko: data.nazwisko,
        user: data.login,
        page: req.cookies.page,
      };
      res.json(userData);
    }
  } else {
    res.clearCookie("imie");
    res.clearCookie("nazwisko");
    res.clearCookie("user");
    res.clearCookie("page");
    res.status(200).json({ message: "XD" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("imie");
  res.clearCookie("nazwisko");
  res.clearCookie("user");
  res.clearCookie("page");
  res.status(200).json({ message: "Logout successful" });
});

app.post("/get-files", (req, res) => {
  let user = req.body.user;
  const filePath = req.body.filePath;

  if (
    user ===
    req.cookies.user.slice(
      50,
      50 + req.cookies.imie.length + req.cookies.nazwisko.length
    )
  ) {
    if (filePath !== undefined && filePath !== null) {
      const directoryPath = path.join(
        __dirname,
        "..",
        "client",
        "public",
        filePath
      );

      if (filePath.indexOf(".") !== -1) {
        res.json("File");
      } else {
        fs.readdir(directoryPath, (err, files) => {
          if (err) {
            console.error("Error reading directory:", err);
            res.status(500).json("Error");
          } else {
            const folderContents = files.map((file) => ({
              name: file,
              fullPath: path.join(filePath, file),
            }));
            res.json(folderContents);
          }
        });
      }
    } else {
      const userDirectoryPath = path.resolve(
        __dirname,
        "../client/public",
        user
      );

      fs.readdir(userDirectoryPath, (err, files) => {
        if (err) {
          console.error("Error reading directory:", err);
          res.status(500).json("Error");
        } else {
          const folderContents = files.map((file) => ({
            name: file,
            fullPath: path.join(file),
          }));
          res.json(folderContents);
        }
      });
    }
  } else {
    res.status(401).json("Error");
  }
});

app.post("/get-case-files", async (req, res) => {
  const signature = req.body.signature;
  const folderPath = path.join(__dirname, "public", "akta", signature);

  try {
    const files = readFilesInFolder(folderPath);
    res.json({ files });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while reading the files." });
  }
});

function readFilesInFolder(folderPath) {
  const filesData = [];
  if (fs.existsSync(folderPath)) {
    const folderContents = fs.readdirSync(folderPath);
    folderContents.forEach((file) => {
      const filePath = path.join(folderPath, file);
      filesData.push({ name: file });
    });
  }
  return filesData;
}

app.post("/get-directory", (req, res) => {
  const previousFolderPath = path.resolve(__dirname, "..");
  const reversedFolderPath = path
    .normalize(previousFolderPath)
    .replace(/\\/g, "/");
  res.json(reversedFolderPath);
});

app.post("/open-file", (req, res) => {
  const filePath = req.body.fullPath;
  const fullPath = path.resolve(filePath);
  res.sendFile(fullPath);
});

app.post("/del-file", (req, res) => {
  const filePath = req.body.fullPath;

  try {
    if (fs.existsSync(filePath)) {
      fs.removeSync(filePath);
      console.log("File or directory deleted successfully");
      res
        .status(200)
        .json({ message: "File or directory deleted successfully" });
    } else {
      res.status(404).json({ error: "File or directory not found" });
    }
  } catch (error) {
    console.error("Error deleting file or directory:", error);
    res.status(500).json({ error: "Error deleting file or directory" });
  }
});

app.post("/add-folder", (req, res) => {
  const path = req.body.filePath;
  const name = req.body.name;

  const parent = require("path").resolve(__dirname, "..");
  const p = (parent + "/client/public" + path + "/" + name).replace(/\\/g, "/");

  fs.mkdir(p, { recursive: true }, (err) => {
    if (err) {
      console.error("Error creating folder:", err);
      res.status(500).json({ error: "Error creating folder" });
    } else {
      console.log("Folder created successfully");
      res.status(200).json({ message: "Folder created successfully" });
    }
  });
});

app.post("/upload", (req, res) => {
  if (!req.files || !req.body.filePath) {
    return res.status(400).json({ message: "Invalid file upload" });
  }

  const file = req.files.file;
  const filePath = req.body.filePath;

  const parent = require("path").resolve(__dirname, "..");
  const p = (parent + "/client/public" + filePath + "/" + file.name).replace(
    /\\/g,
    "/"
  );

  file.mv(p, (err) => {
    if (err) {
      console.error("Error uploading file:", err);
      return res.status(500).json({ message: "Error uploading file" });
    }

    console.log("File uploaded:", p);

    res.json({ message: "File uploaded successfully" });
  });
});

app.post("/get-Cases", async (req, res) => {
  const user = req.cookies.user.slice(
    50,
    50 + req.cookies.imie.length + req.cookies.nazwisko.length
  );

  const aktaUsers = await db
    .collection("aktaUsers")
    .find({ user: user })
    .toArray();

  let results = [];

  for (const aktaUser of aktaUsers) {
    const signature = aktaUser.signature;

    const aktaResults = await db
      .collection("akta")
      .find({ signature: signature })
      .toArray();

    const resultsWithStatus = aktaResults.map((item) => ({
      ...item,
      status: aktaUser.status,
      message: aktaUser.message,
    }));
    results.push(...resultsWithStatus);
  }

  const isoFormattedDate = (dateString) => {
    const [dayMonthYear, time] = dateString.split(" / ");
    const [day, month, year] = dayMonthYear.split("-");
    const [hour, minutes] = time.split(":");
    return `${year}-${month}-${day}T${hour}:${minutes}:00Z`;
  };

  if (req.body.sort === true) {
    results.sort((a, b) => {
      const dateA = new Date(isoFormattedDate(a.realization));
      const dateB = new Date(isoFormattedDate(b.realization));
      return dateA - dateB;
    });
    results = results.filter((item) => item.done === "");
  }

  res.json(results);
});

app.post("/get-users", async (req, res) => {
  const users = await col.find().sort({ nazwisko: 1 }).toArray();
  res.json(users);
});

app.post("/assign", async (req, res) => {
  const check = await aktaUsersDb
    .find({
      signature: req.body.signature,
      user: req.body.user,
    })
    .toArray();

  if (check.length == 0) {
    await aktaUsersDb.insertOne({
      signature: req.body.signature,
      user: req.body.user,
      status: "pending",
      message: req.body.description,
    });
  }

  res.json("Success");
});

app.post("/accept", async (req, res) => {
  await aktaUsersDb.updateOne(
    {
      signature: req.body.signature,
      user: req.cookies.user.slice(
        50,
        50 + req.cookies.imie.length + req.cookies.nazwisko.length
      ),
    },
    { $set: { status: "accepted" } }
  );
  res.json("Success");
});

app.post("/reject", async (req, res) => {
  if (req.body.description != undefined) {
    await aktaUsersDb.updateOne(
      {
        signature: req.body.signature,
        user: req.cookies.user.slice(
          50,
          50 + req.cookies.imie.length + req.cookies.nazwisko.length
        ),
      },
      { $set: { status: "rejected", description: req.body.description } }
    );
  } else {
    await aktaUsersDb.updateOne(
      {
        signature: req.body.signature,
        user: req.cookies.user.slice(
          50,
          50 + req.cookies.imie.length + req.cookies.nazwisko.length
        ),
      },
      { $set: { status: "rejected" } }
    );
  }

  res.json("Success");
});

app.post("/create-case", async (req, res) => {
  const title = req.body.title;
  const description = req.body.desc;
  const date = req.body.date;
  const user = req.cookies.user.slice(
    50,
    50 + req.cookies.imie.length + req.cookies.nazwisko.length
  );

  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let identifier = "";

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      identifier += characters[randomIndex];
    }

    if (i < 2) {
      identifier += "-";
    }
  }

  identifier = identifier.toUpperCase();

  const currentDate = new Date();

  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear().toString();

  const dateString = `${day}-${month}-${year}`;

  await aktaDb.insertOne({
    signature: identifier,
    body: description,
    title: title,
    user: user,
    made: dateString,
    realization: date,
    done: "",
  });
  await aktaUsersDb.insertOne({
    signature: identifier,
    user: user,
    status: "made",
    message: "Stworzyłeś tą sprawę.",
  });
  res.json(identifier);
});

app.post("/get-allowed", async (req, res) => {
  const data = await aktaUsersDb
    .find({
      signature: req.body.signature,
      status: { $in: ["accepted", "made", "done", "rejected"] },
    })
    .toArray();
  res.json(data);
});

app.post("/delete-case", async (req, res) => {
  await aktaUsersDb.deleteMany({ signature: req.body.signature });
  await aktaDb.deleteOne({ signature: req.body.signature });

  const folderPath = path.join(__dirname, "public", "akta", req.body.signature);
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
  }

  res.json("Success");
});

app.post("/end-case", async (req, res) => {
  const signature = req.body.signature;

  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear().toString();
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");

  const dateString = `${day}-${month}-${year} ${hours}:${minutes}`;

  await aktaUsersDb.updateMany(
    { signature: signature },
    { $set: { status: "done" } }
  );

  await aktaDb.updateOne(
    { signature: signature },
    { $set: { done: dateString } }
  );

  res.json("Success");
});

app.post("/change-password", async (req, res) => {
  const newPassword = req.body.newPassword;
  const currentPassword = req.body.currentPassword;
  const user = req.cookies.user.slice(
    50,
    50 + req.cookies.imie.length + req.cookies.nazwisko.length
  );
  const data = await col.findOne({ login: user });

  if (data.haslo === currentPassword) {
    await col.updateOne({ login: user }, { $set: { haslo: newPassword } });
  } else {
    console.log("error");
  }
});

app.post("/upload-to-case", async (req, res) => {
  if (!req.files || !req.body.identifier) {
    return res.status(400).json({ message: "Invalid file upload" });
  }

  const file = req.files.file;
  const identifier = req.body.identifier;
  const name = file.name;

  const directoryPath = path.join(__dirname, "public", "akta", identifier);

  const fileSizeInBytes = file.size;

  // Calculate the directory size synchronously
  let directorySizeWithFileInBytes = fileSizeInBytes;
  try {
    if (fs.existsSync(directoryPath)) {
      const files = fs.readdirSync(directoryPath);

      for (const file of files) {
        const filePath = path.join(directoryPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isFile()) {
          directorySizeWithFileInBytes += stat.size;
        }
      }

      const directorySizeInGB =
        directorySizeWithFileInBytes / (1024 * 1024 * 1024);

      if (directorySizeInGB > 1) {
        return res.json({
          message: "Katalog przekracza dozwolony rozmiar (1 GB).",
        });
      }
    } else {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Error processing directory" });
  }

  try {
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
  } catch (error) {
    console.error("Error creating directory:", error);
    return res.status(500).json({ message: "Error creating directory" });
  }

  const completeFilePath = path.join(directoryPath, name);

  file.mv(completeFilePath, (err) => {
    if (err) {
      console.error("Error uploading file:", err);
      return res.status(500).json({ message: "Error uploading file" });
    }

    console.log("File uploaded:", completeFilePath);

    res.json({ message: "File uploaded successfully" });
  });
});

app.post("/get-pending-cases", async (req, res) => {
  const user = req.cookies.user.slice(
    50,
    50 + req.cookies.imie.length + req.cookies.nazwisko.length
  );
  const data = await aktaUsersDb
    .find({ user: user, status: "pending" })
    .toArray();
  res.json({ number: data.length });
});

app.post("/set-page", (req, res) => {
  const { page } = req.body;
  res.cookie("page", page);
  res.json({ message: "Page set successfully" });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
