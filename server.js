const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

/* ================= GMAIL TRANSPORT ================= */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,   // ✅ FIXED
    pass: process.env.EMAIL_PASS,   // ✅ FIXED (App Password)
  },
});

/* ================= TEST ROUTE ================= */

app.get("/", (req, res) => {
  res.send("Booking Mail Server Running ✅");
});

/* ================= BOOKING ROUTE ================= */

app.post("/book-taxi", async (req, res) => {
  console.log("📥 RECEIVED BOOKING REQUEST:", req.body);
  const {
    name,
    mobile,
    from,
    to,
    date,
    time,
    tripType,
    message,
  } = req.body;

  try {
    await transporter.sendMail({
      from: `"WINFLY DROP TAXI 🚖" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🚨 New Booking: ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f0f2f5; }
            .wrapper { background-color: #f0f2f5; padding: 40px 10px; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.08); border: 1px solid rgba(225, 29, 72, 0.1); }
            .header { background: #1e293b; color: white; padding: 50px 20px; text-align: center; position: relative; }
            .header::after { content: ""; position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #e11d48, #be123c); }
            .header h1 { margin: 0; font-size: 28px; letter-spacing: 4px; text-transform: uppercase; font-weight: 800; }
            .header p { margin: 12px 0 0; opacity: 0.7; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; }
            .content { padding: 40px; }
            .badge { display: inline-block; background: #fff1f2; color: #e11d48; padding: 8px 20px; border-radius: 100px; font-size: 12px; font-weight: 700; margin-bottom: 30px; border: 1px solid rgba(225, 29, 72, 0.2); }
            .section { margin-bottom: 35px; }
            .section-label { font-size: 11px; font-weight: 800; color: #e11d48; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px; display: block; }
            .data-card { background: #f8fafc; border-radius: 16px; padding: 25px; border: 1px solid #e2e8f0; }
            .data-row { margin-bottom: 15px; border-bottom: 1px solid #edf2f7; padding-bottom: 10px; }
            .data-row:last-child { margin-bottom: 0; border-bottom: none; padding-bottom: 0; }
            .data-label { font-size: 11px; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
            .data-value { font-size: 16px; font-weight: 600; color: #1e293b; }
            .journey-track { position: relative; padding-left: 30px; margin-top: 15px; }
            .dot { position: absolute; left: 0; width: 12px; height: 12px; border-radius: 50%; border: 3px solid #fff; }
            .dot-pickup { top: 4px; background: #e11d48; box-shadow: 0 0 10px rgba(225, 29, 72, 0.4); }
            .dot-drop { bottom: 4px; background: #1e293b; }
            .line { position: absolute; left: 5px; top: 16px; bottom: 16px; width: 2px; background: #e2e8f0; border-left: 1px dashed #cbd5e1; }
            .highlight-text { color: #e11d48; font-weight: 700; }
            .footer { text-align: center; padding: 40px 20px; background: #1e293b; color: rgba(255,255,255,0.6); font-size: 12px; }
            .footer p { margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <h1>WINFLY DROP TAXI</h1>
                <p>Executive Booking Notification</p>
              </div>
              
              <div class="content">
                <div style="text-align: center;">
                  <div class="badge">BOOKING ID: ${req.body.bookingId || "INTERNAL"}</div>
                </div>

                <div class="section">
                  <span class="section-label">Passenger Information</span>
                  <div class="data-card">
                    <table width="100%">
                      <tr>
                        <td>
                          <div class="data-label">Full Name</div>
                          <div class="data-value">${name}</div>
                        </td>
                        <td align="right">
                          <div class="data-label">Mobile Number</div>
                          <div class="data-value">${mobile}</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>

                <div class="section">
                  <span class="section-label">Journey Details</span>
                  <div class="data-card">
                    <div class="data-row">
                      <div class="data-label">Pickup Address (City/District)</div>
                      <div class="data-value">${from}, ${req.body.fromSubDistrict || ""}</div>
                    </div>
                    <div class="data-row">
                      <div class="data-label">Pickup State</div>
                      <div class="data-value">${req.body.pickupState || "—"}</div>
                    </div>
                    <div class="data-row" style="margin-top: 20px;">
                      <div class="data-label">Drop Address (City/District)</div>
                      <div class="data-value">${to}, ${req.body.toSubDistrict || ""}</div>
                    </div>
                    <div class="data-row">
                      <div class="data-label">Drop State</div>
                      <div class="data-value">${req.body.dropState || "—"}</div>
                    </div>
                  </div>
                </div>

                <div class="section">
                  <span class="section-label">Schedule & Service</span>
                  <div class="data-card">
                    <table width="100%">
                      <tr>
                        <td>
                          <div class="data-label">Pickup Date</div>
                          <div class="data-value">${date}</div>
                        </td>
                        <td>
                          <div class="data-label">Pickup Time</div>
                          <div class="data-value highlight-text">${time}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 15px;">
                          <div class="data-label">Type of Trip</div>
                          <div class="data-value" style="text-transform: capitalize;">${tripType}</div>
                        </td>
                        <td align="right" style="padding-top: 15px;">
                          <div class="data-label">Select Vehicle</div>
                          <div class="data-value highlight-text" style="text-transform: uppercase;">${req.body.vehicleType || "Executive"}</div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>

                <div class="section">
                  <span class="section-label">Complete Address Logs</span>
                  <div class="data-card">
                    <div class="data-row">
                      <div class="data-label">Full Pickup Address</div>
                      <div class="data-value" style="font-weight: 400; font-size: 14px;">${req.body.pickupAddress || "N/A"}</div>
                    </div>
                    <div class="data-row">
                      <div class="data-label">Pincode</div>
                      <div class="data-value">${req.body.pincode || "—"}</div>
                    </div>
                    <div class="data-row">
                      <div class="data-label">Full Drop Address</div>
                      <div class="data-value" style="font-weight: 400; font-size: 14px;">${req.body.dropAddress || "N/A"}</div>
                    </div>
                  </div>
                </div>

                <div class="section">
                  <span class="section-label">Communication</span>
                  <div class="data-card">
                    <div class="data-label">Special Requests (Optional)</div>
                    <div class="data-value" style="font-style: italic; color: #e11d48;">"${req.body.specialRequests || message || "No special requests."}"</div>
                  </div>
                </div>

                <div style="text-align: center; margin-top: 10px;">
                  <p style="color: #64748b; font-size: 13px;">This is an automated encrypted notification from the WINFLY Central Dispatch System.</p>
                </div>
              </div>

              <div class="footer">
                <p><strong>WINFLY DROP TAXI & TAXI SERVICE</strong></p>
                <p>© ${new Date().getFullYear()} GLOBAL DISPATCH CENTER</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    res.json({
      success: true,
      message: "Booking received & mail sent to admin ✅",
    });
  } catch (error) {
    console.error("MAIL ERROR ❌", error);
    res.status(500).json({
      success: false,
      message: "Mail sending failed ❌",
    });
  }
});

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
