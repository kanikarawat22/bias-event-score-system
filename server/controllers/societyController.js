const prisma = require("./prismaClient");
const bcrypt = require("bcryptjs");
const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const registerSociety = async (req, res) => {
  try {
    const {
      societyName,
      societyEmail,
      password,
      secretaryName,
      secretaryNumber,
    } = req.body;

    const existingSociety = await prisma.society.findUnique({
      where: {
        societyEmail,
      },
    });

    if (existingSociety) {
      return res.status(400).json({
        message: "Society already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSociety = await prisma.society.create({
      data: {
        societyName,
        societyEmail,
        password: hashedPassword,
        secretaryName,
        secretaryNumber,
        societyLogo: req.file ? req.file.path : "",
      },
    });

    res.status(201).json({
      message: "Society registered successfully",
      society: newSociety,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const loginSociety = async (req, res) => {
  try {
    const { societyEmail, password } = req.body;

    const society = await prisma.society.findUnique({
      where: {
        societyEmail,
      },
    });

    if (!society) {
      res.status(200).json({
  message: "Login successful",
  society: {
    id: society.id,
    societyName: society.societyName,
    societyEmail: society.societyEmail,
    secretaryName: society.secretaryName,
    secretaryNumber: society.secretaryNumber,
    societyLogo: society.societyLogo,
  },
});
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      society.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    res.status(200).json({
      message: "Login successful",
      society,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const createEvent = async (req, res) => {
  try {
    console.log(req.body);
    const {
      eventName,
      eventDescription,
      eventDate,
      venue,
      numberOfJudges,
      status,
      societyId,
      criteria,
    } = req.body;

    const newEvent = await prisma.event.create({
      data: {
        eventName,
        eventDescription,
        eventDate: new Date(eventDate),
        venue,
        numberOfJudges: parseInt(numberOfJudges),
        status,
        societyId: parseInt(societyId),

        criteria: {
          create: criteria.map((criterion) => ({
            name: criterion.name,
            maxMarks: parseInt(criterion.maxMarks),
          })),
        },
      },

      include: {
        criteria: true,
      },
    });

    res.status(201).json({
      message: "Event created successfully",
      event: newEvent,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const getSocietyEvents = async (req, res) => {
  try {
    const { societyId } = req.params;

    const events = await prisma.event.findMany({
      where: {
        societyId: parseInt(societyId),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(events);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const entries = await prisma.entry.findMany({
      where: {
        eventId: parseInt(eventId),
      },
    });

    const entryIds = entries.map((entry) => entry.id);

    await prisma.score.deleteMany({
      where: {
        entryId: {
          in: entryIds,
        },
      },
    });

    await prisma.judge.deleteMany({
      where: {
        eventId: parseInt(eventId),
      },
    });

    await prisma.entry.deleteMany({
      where: {
        eventId: parseInt(eventId),
      },
    });

    await prisma.scoringCriterion.deleteMany({
      where: {
        eventId: parseInt(eventId),
      },
    });

    await prisma.event.delete({
      where: {
        id: parseInt(eventId),
      },
    });

    res.status(200).json({
      message: "Event deleted successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const getSingleEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await prisma.event.findUnique({
      where: {
        id: parseInt(eventId),
      },
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.status(200).json(event);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const {
      eventName,
      eventDescription,
      eventDate,
      venue,
      numberOfJudges,
      status,
    } = req.body;

    const updatedEvent = await prisma.event.update({
      where: {
        id: parseInt(eventId),
      },
      data: {
        eventName,
        eventDescription,
        eventDate: new Date(eventDate),
        venue,
        numberOfJudges: parseInt(numberOfJudges),
        status,
      },
    });

    res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const addJudge = async (req, res) => {
  try {
    const { judgeName, judgePin, eventId } = req.body;

    const event = await prisma.event.findUnique({
      where: {
        id: parseInt(eventId),
      },
      include: {
        judges: true,
      },
    });

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (event.judges.length >= event.numberOfJudges) {
      return res.status(400).json({
        message: "Maximum judge limit reached",
      });
    }

    const newJudge = await prisma.judge.create({
      data: {
        judgeName,
        judgePin,
        eventId: parseInt(eventId),
      },
    });

    res.status(201).json({
      message: "Judge added successfully",
      judge: newJudge,
    });

  } catch (error) {
    console.log(error);

    if (error.code === "P2002") {
      return res.status(400).json({
        message: "Judge PIN already exists",
      });
    }

    res.status(500).json({
      message: "Server error",
    });
  }
};
const getEventJudges = async (req, res) => {
  try {
    const { eventId } = req.params;

    const judges = await prisma.judge.findMany({
      where: {
        eventId: parseInt(eventId),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(judges);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const judgeLogin = async (req, res) => {
  try {
    const { judgePin } = req.body;

    const judge = await prisma.judge.findFirst({
      where: {
        judgePin,
      },
      include: {
        event: true,
      },
    });

    if (!judge) {
      return res.status(404).json({
        message: "Invalid Judge PIN",
      });
    }

    res.status(200).json({
      message: "Judge login successful",
      judge,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const addEntry = async (req, res) => {
  try {
    const { entryName, eventId } = req.body;

    const newEntry = await prisma.entry.create({
      data: {
        entryName,
        eventId: parseInt(eventId),
      },
    });

    res.status(201).json({
      message: "Entry added successfully",
      entry: newEntry,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getEventEntries = async (req, res) => {
  try {
    const { eventId } = req.params;

    const entries = await prisma.entry.findMany({
      where: {
        eventId: parseInt(eventId),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(entries);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const getJudgeDashboardData = async (req, res) => {
  try {
    const { judgeId } = req.params;

    const judge = await prisma.judge.findUnique({
      where: {
        id: parseInt(judgeId),
      },
      include: {
        event: {
          include: {
            criteria: true,
            entries: true,
          },
        },
      },
    });

    if (!judge) {
      return res.status(404).json({
        message: "Judge not found",
      });
    }

    res.status(200).json(judge);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const submitScore = async (req, res) => {
  try {
    const {
      judgeId,
      entryId,
      marks,
      totalMarks,
    } = req.body;

    const existingScore = await prisma.score.findFirst({
      where: {
        judgeId: parseInt(judgeId),
        entryId: parseInt(entryId),
      },
    });

    if (existingScore) {
      return res.status(400).json({
        message: "You have already scored this entry",
      });
    }

    const newScore = await prisma.score.create({
      data: {
        judgeId: parseInt(judgeId),
        entryId: parseInt(entryId),
        marks,
        totalMarks: parseInt(totalMarks),
      },
    });

    // get judge with event
    const judge = await prisma.judge.findUnique({
      where: {
        id: parseInt(judgeId),
      },
      include: {
        event: {
          include: {
            judges: true,
            entries: true,
          },
        },
      },
    });

    const totalJudges = judge.event.judges.length;
    const totalEntries = judge.event.entries.length;

    const expectedScoreCount = totalJudges * totalEntries;

    const eventJudgeIds = judge.event.judges.map(
  (judge) => judge.id
);

const currentScoreCount = await prisma.score.count({
  where: {
    judgeId: {
      in: eventJudgeIds,
    },
  },
});

    if (currentScoreCount === expectedScoreCount) {
      await prisma.event.update({
        where: {
          id: judge.event.id,
        },
        data: {
          status: "Completed",
        },
      });
    }

    res.status(201).json({
      message: "Score submitted successfully",
      score: newScore,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const getLeaderboard = async (req, res) => {
  try {
    const { societyId } = req.params;

    const events = await prisma.event.findMany({
      where: {
        societyId: parseInt(societyId),
      },
      include: {
        entries: {
          include: {
            scores: true,
          },
        },
      },
    });

    const leaderboardData = events
      .map((event) => {
        const rankings = event.entries
          .map((entry) => {
            const total = entry.scores.reduce(
              (sum, score) => sum + score.totalMarks,
              0
            );

            return {
              entryName: entry.entryName,
              total,
            };
          })
          .filter((entry) => entry.total > 0)
          .sort((a, b) => b.total - a.total);

        return {
          eventName: event.eventName,
          rankings,
        };
      })
      .filter((event) => event.rankings.length > 0);

    res.status(200).json(leaderboardData);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteJudge = async (req, res) => {
  try {
    const { judgeId } = req.params;

    await prisma.score.deleteMany({
      where: {
        judgeId: parseInt(judgeId),
      },
    });

    await prisma.judge.delete({
      where: {
        id: parseInt(judgeId),
      },
    });

    res.status(200).json({
      message: "Judge deleted successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
const generateCertificate = async (req, res) => {
  try {
    const {
      participantName,
      eventName,
      position,
      description,
      societyLogo,
    } = req.body;

    const facultyHead = req.files.facultyHeadSignature?.[0];
    const director = req.files.directorSignature?.[0];
    const convener = req.files.convenerSignature?.[0];

    const collegeLogoPath = path.join(
      __dirname,
      "../assets/college-logo.png"
    );

    const doc = new PDFDocument({
      layout: "landscape",
      size: "A4",
      margin: 0,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=certificate.pdf"
    );

    doc.pipe(res);

    doc.rect(0, 0, 842, 595).fill("#ffffff");

    doc
      .lineWidth(3)
      .strokeColor("#d4af37")
      .rect(25, 25, 792, 545)
      .stroke();

    // Society Logo (Cloudinary URL)
    if (societyLogo) {
      const societyResponse = await axios.get(societyLogo, {
        responseType: "arraybuffer",
      });

      doc.image(societyResponse.data, 70, 50, {
        width: 90,
      });
    }

    // College Logo (local asset)
    doc.image(collegeLogoPath, 680, 50, {
      width: 90,
    });

    doc
      .fillColor("#111827")
      .font("Helvetica-Bold")
      .fontSize(34)
      .text("CERTIFICATE", 0, 90, {
        align: "center",
        width: 842,
      });

    doc
      .font("Helvetica")
      .fontSize(20)
      .text("OF ACHIEVEMENT", 0, 135, {
        align: "center",
        width: 842,
      });

    doc
      .fontSize(16)
      .fillColor("#6b7280")
      .text("PROUDLY PRESENTED TO", 0, 210, {
        align: "center",
        width: 842,
      });

    doc
      .font("Helvetica-Bold")
      .fontSize(32)
      .fillColor("#1d4ed8")
      .text(participantName, 0, 255, {
        align: "center",
        width: 842,
      });

    doc
      .font("Helvetica")
      .fontSize(18)
      .fillColor("#111827")
      .text(`for securing ${position}`, 0, 320, {
        align: "center",
        width: 842,
      });

    doc
      .font("Helvetica-Bold")
      .fontSize(22)
      .fillColor("#1e40af")
      .text(eventName, 0, 360, {
        align: "center",
        width: 842,
      });

    doc
      .font("Helvetica")
      .fontSize(14)
      .fillColor("#374151")
      .text(
        description ||
          "In recognition of outstanding participation and achievement.",
        170,
        410,
        {
          align: "center",
          width: 500,
        }
      );

    // Signatures from Cloudinary
    if (facultyHead?.path) {
      const facultyResponse = await axios.get(facultyHead.path, {
        responseType: "arraybuffer",
      });

      doc.image(facultyResponse.data, 140, 480, {
        width: 100,
      });
    }

    if (director?.path) {
      const directorResponse = await axios.get(director.path, {
        responseType: "arraybuffer",
      });

      doc.image(directorResponse.data, 370, 480, {
        width: 100,
      });
    }

    if (convener?.path) {
      const convenerResponse = await axios.get(convener.path, {
        responseType: "arraybuffer",
      });

      doc.image(convenerResponse.data, 600, 480, {
        width: 100,
      });
    }

    doc
      .font("Helvetica")
      .fontSize(12)
      .fillColor("#111827")
      .text("Faculty Head", 135, 550);

    doc.text("Director", 395, 550);

    doc.text("Faculty Convener", 580, 550);

    doc.end();

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Certificate generation failed",
    });
  }
};
module.exports = {
  getLeaderboard,
  getJudgeDashboardData,
  submitScore,
  registerSociety,
  loginSociety,
  createEvent,
  getSocietyEvents,
  deleteEvent,
  getSingleEvent,
  updateEvent,
  addJudge,
  getEventJudges,
  judgeLogin,
  addEntry,
  getEventEntries,
  deleteJudge,
  generateCertificate,
};