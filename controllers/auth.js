import bcrypt from "bcryptjs";
import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const register = (req, res) => 
{
    //Check if user exists
    const sql = "SELECT * FROM tbl_user WHERE contact_number LIKE ? OR email_id LIKE ?";
    db.query(sql, [req.body.contact_number,req.body.email_id], (err, data) => {
        if(err) return res.status(500).json(err);
        if(data.length) return res.status(409).json("Contact number/ Email ID already exists");
        
        //Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password.toString(), salt);

        const sql = "INSERT INTO tbl_user (`name`,`contact_number`,`email_id`,`password`) VALUES (?,?,?,?)";
        const values = [req.body.name,req.body.contact_number,req.body.email_id,hashedPassword];

        db.query(sql, values, (err, data) => {
            if(err) return res.status(500).json(err);
            return res.status(200).json("User has been created");
        });
    });
}

export const login = (req, res) => 
{
    const sql = "SELECT * FROM tbl_user WHERE contact_number LIKE ? OR email_id LIKE ?";

    db.query(sql, [req.body.login_id,req.body.login_id], (err, data) => {
        if(err) return res.status(500).json(err);
        if(data.length === 0) return res.status(404).json("User not found!");

        const checkPassword = bcrypt.compareSync(req.body.password.toString(), data[0].password);

        if(!checkPassword) return res.json(400).json("Inavlid Contact number / Email ID or password!");

        const token = jwt.sign({ id: data[0].user_id}, process.env.JWT);
        const user = {
            name: data[0].name,
            contact_number: data[0].contact_number,
            email_id: data[0].email_id
        }

        const details = {
            user,
            token
        };

        return res.status(200).json(details);
    });
}