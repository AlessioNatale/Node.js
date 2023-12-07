import { Request, Response } from "express";
import Joi from "joi";
import {db} from "./../db.js"


const getAll = async (req: Request, res: Response) => {
  const planets = await db.many(`SELECT * FROM planets;`)
  res.status(200).json(planets);
};

const getOneById = async (req: Request, res: Response) => {
  const { id } = req.params;
  // const id = req.params.id
  const planet = await db.oneOrNone(`SELECT * FROM planets WHERE id=$1;`, Number(id))

  res.status(200).json(planet);
};

const planetSchema = Joi.object({
  name: Joi.string().required(),
});

const create = async (req: Request, res: Response) => {
  const {name } = req.body;
  const newPlanet = { name };
  const validatedNewPlanet = planetSchema.validate(newPlanet)

  if (validatedNewPlanet.error) {
    return res.status(400).json({msg : validatedNewPlanet.error.details[0].message})
  } else {
    await db.none(`INSERT INTO planets (name) VALUES ($1)`, name);

    res.status(201).json({ msg: "The planet was create" });
  }
  //console.log(planets);
};

const updateById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
 
  await db.none(`UPDATE planets SET name=$2 WHERE id=$1`, [id, name]);

 // console.log(planets);

  res.status(200).json({ msg: "The planet was updated" });
};

const deleteById = async (req: Request, res: Response) => {
  const { id } = req.params;
  await db.none(`DELETE FROM planets WHERE id=$1`, Number(id));

  //console.log(planets);

  res.status(200).json({ msg: "The planet was deleted" });
};

const createImage = async (req: Request, res: Response) => {
  // console.log(req.file);
  const {id} = req.params;
  const fileName = req.file?.path;

  if (fileName) {
    db.none(`UPDATE planets SET image=$2 WHERE id=$1`, [id, fileName])
    res.status(201).json({ msg: "Planet image uploaded successfully"})
  } else {
    res.status(400).json({msg: "planet image failed to upload"})
  }
  

  res.status(201).json({msg: "Planet image uploaded successfully"})
}

export {getAll, getOneById, create, updateById, deleteById, createImage}
