const notes = require('./notes')
const { nanoid } = require('nanoid')
const { response } = require('@hapi/hapi/lib/validation')

const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload

    const id = nanoid(16) 
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const newNotes = {
        title,tags,body,id,createdAt,updatedAt
    }
    notes.push(newNotes)
    
    const isSuccess = notes.filter((note) => note.id === id ).length > 0 ;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'berhasil menambahkan notes',
            data : {
                noteId : id
            }
        })
        response.code(201)
        return response;
    }
    const response = h.response({
        status: 'failed',
        message: 'gagal menambahkan note'
    })
    response.code(500)
    return response;
}
const getAllNotesHandler = (request, h) => {
    if (notes.length === 0) {
        const response = h.response({
            status: 'empty',
            message: 'notes masih kosong'
        })
        return response;
    }
    const response = h.response({
        status: 'success',
        data: {
            notes,
        }
    })
    response.code(200)
    return response;
}

const getNoteByIdHandler = (request, h) => {
    const {id} = request.params;
    const note = notes.filter((note) => note.id === id)[0]

    if (note !== undefined) {
        return {
            status: 'success',
            data : {
                note,
            }
        }
    }
    const response = h.response({
        status: 'fail',
        message: 'catatan tidak ditemukan,buat catatan terlebih dahulu',

    })
    response.code(404)
    return response;
}

const editNoteByIdHandler = (request, h) => {
    const {tags,body,title} = request.payload;
    const {id} = request.params;
    const updatedAt = new Date().toISOString()
    
    const index = notes.findIndex((note) => note.id === id)
    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        }
        const response = h.response({
            status: 'success',
            message: 'berhasil mengedit catatan',

        })
        response.code(201)
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'gagal mengedit catatan',

    })
    response.code(500);
    return response;

}

const deletNoteByIdHandler = (request, h) => {
    const {id} = request.params;
    const index = notes.findIndex((note) => note.id === id)
    
    if (index !== -1) {
        notes.splice(index,1)
        const response = h.response({
            status: 'success',
            message: 'berhasil mengapus note',
        })
        response.code(200)
        return response;
    }   
    const response = h.response({
        status: 'fail',
        message: 'gagal menghapus pesan',
    })
    response.code(500)
    return response;
}
module.exports = {addNoteHandler,getAllNotesHandler,getNoteByIdHandler,editNoteByIdHandler,deletNoteByIdHandler }