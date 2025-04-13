import Note from '../models/note.js';


export const getNotes = async (req,res)=>{
const notes = await Note.find().sort({position:1})
res.json(notes)
}

export const createNotes =  async (req, res) => {
    const { title, content } = req.body;
    const count = await Note.countDocuments();
    const newNote = new Note({ title, content, position: count });
    await newNote.save();
    res.status(201).json(newNote);
  }

  export const reOrder = async (req,res)=>{
    const { reorderedNotes } = req.body;
    for (let i = 0; i < reorderedNotes.length; i++) {
      await Note.findByIdAndUpdate(reorderedNotes[i]._id, { position: i });
    }
    res.json({ message: "Reordered successfully" });
  }

 