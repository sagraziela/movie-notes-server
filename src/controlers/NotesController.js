const knex = require("../database/knex");

class NotesController {
    async create(request, response) {
        const { title, rate, description, tags, links } = request.body;
        const user_id = request.user.id;

        const note_id = await knex("notes").insert({
            title,
            rate,
            description,
            user_id
        });

        const tagsInsert = tags.map(tag => {
            return {
                name: tag,
                note_id,
                user_id
            }
        });

        await knex("tags").insert(tagsInsert);

        return response.status(201).json();

    }

    async show(request, response) {
        const { id } = request.params;

        const note = await knex("notes").where({ id }).first();
        const tags = await knex("tags").where({note_id: id}).orderBy("name");
        const links = await knex("links").where({note_id: id}).orderBy("created_at");

        return response.json({
            ...note,
            tags,
            links
        })
    }

    async delete(request, response) {
        const { id } = request.params;
        
        await knex("notes").where({ id }).delete();

        return response.json();
    }

    async index(request, response) {
        const { title, tag } = request.query;
        const user_id = request.user.id;

        const userTags = await knex("tags").where({ user_id });

        const notesByTitle = await knex("notes")
            .where({ user_id })
            .whereLike("title", `%${title}%`)
            .orderBy("title");
        
        const NotesByTitleWithTags = notesByTitle.map(note => {
            const notesTags = userTags.filter(tag => tag.note_id === note.id);

            return {
                ...note,
                tags: notesTags
            }
        })

        if (!notesByTitle[0]) {

            const notesByTag = await knex("tags")
            .select([
                "notes.id",
                "notes.title",
                "notes.rate",
                "notes.description",
                "notes.user_id",
            ])
            .where("notes.user_id", user_id)
            .whereLike("tags.name", `%${tag}%`)
            .innerJoin("notes", "notes.id", "tags.note_id")
            .groupBy("notes.id")
            .orderBy("notes.title")

            const filteredNotesByTag = notesByTag.map(note => {
                const noteTags = userTags.filter(tag => tag.note_id === note.id)

                return {
                    ...note,
                    tags: noteTags
                }
            })

            return response.json(filteredNotesByTag);

        } else {
            return response.json(NotesByTitleWithTags);
        }

    }
}

module.exports = NotesController;