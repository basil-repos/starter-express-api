import { db } from "../connect.js";
import moment from 'moment';
import CryptoJS  from 'crypto-js';

export const save_lead = (req, res, next) => {
    if(req.body.name == ""){
        return res.status(401).json("Name Required");
    }
    if(req.body.contact_number == ""){
        return res.status(401).json("Contact Number Required");
    }
    try {
        const currentDateTime = moment();
        const formattedDateTime = currentDateTime.format('YYYY-MM-DD HH:mm:ss');

        const sql = "INSERT INTO tbl_lead (`name`,`contact_number`,`created_date`) VALUES (?,?,?)";
        const values = [req.body.name,req.body.contact_number,formattedDateTime];
        
        db.query(sql, values, (err, data) => {
            if(err) return res.status(500).json(err);
            return res.status(200).json({status: 200, message: "Lead has been created"});
        });
    } catch (error) {
        next(error);
    }
}

export const get_leads = (req, res, next) => {
    try {
        const type = req.params.type;
        const types = ["read", "unread", "trash"];
        if (!types.includes(type)) {
            return res.status(400).json("Invalid Type");
        }

        let sql = "SELECT * FROM tbl_lead WHERE ";
        if(type == "trash"){
            sql += "status = 1";
        }else if (type == "read") {
            sql += "read_status = 1 AND status = 0";
        }else {
            sql += "read_status = 0 AND status = 0";
        }

        db.query(sql, [], (err, data) => {
            if(err) return res.status(500).json(err);

            const newData = data.map(d => {
                return {
                    // lead_id: CryptoJS.AES.encrypt(d.lead_id.toString(), process.env.JWT).toString(),
                    lead_id: d.lead_id,
                    name: d.name,
                    contact_number: d.contact_number,
                    created_date: moment(d.created_date).format("ddd DD MMMM YYYY"),
                    created_time: moment(d.created_date).format("hh:mm A"),
                    read_status: d.read_status == 0 ? false : true
                }
            });

            return res.status(200).json(newData);
        });
    } catch (error) {
        next(error);
    }
}

export const update_read_status = (req, res, next) => {
    try {
        const lead_id = req.params.id;
        const type = req.params.type;
        // const byteText = CryptoJS.AES.decrypt(enc_id, process.env.JWT);
        // const lead_id = byteText.toString(CryptoJS.enc.Utf8).toString();
        // const lead_id = CryptoJS.SHA256(enc_id);
        const status = type == "read" ? 1 : 0;
        
        const sql = "UPDATE tbl_lead SET read_status = ? WHERE lead_id = ?";
        
        db.query(sql, [status, lead_id], (err, data) => {
            if(err) return res.status(500).json(err);
            
            return res.status(201).json("Lead updated");
        });
    } catch (error) {
        next(error);
    }
}

export const update_status = (req, res, next) => {
    try {
        const lead_id = req.params.id;
        // const lead_id = CryptoJS.AES.decrypt(enc_id, process.env.JWT);
        
        const sql = "UPDATE tbl_lead SET status = ? WHERE lead_id = ?";
        
        db.query(sql, [1, lead_id], (err, data) => {
            if(err) return res.status(500).json(err);
            
            return res.status(201).json("Lead updated");
        });
    } catch (error) {
        next(error);
    }
}