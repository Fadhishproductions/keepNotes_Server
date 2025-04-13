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

  export const updateNote = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
  
    try {
      const updatedNote = await Note.findByIdAndUpdate(
        id,
        { title, content },
        { new: true }
      );
  
      if (!updatedNote) return res.status(404).json({ message: "Note not found" });
  
      res.json(updatedNote);
    } catch (err) {
      res.status(500).json({ message: "Failed to update note" });
    }
  };
  
  export const deleteNote = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deleted = await Note.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: "Note not found" });
  
      res.json({ message: "Note deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete note" });
    }
  };
  
 