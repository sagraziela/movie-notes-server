const AppError = require("../utils/AppError");
const { hash, compare } = require('bcrypt');
const knex = require("../database/knex")

class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body;

        const emailExists = await knex("users").where({ email }).first();

        if (!name) {
            throw new AppError("O nome é obrigatório!")
        }

        if(emailExists) {
            throw new AppError("Este email já foi cadastrado por outro usuário.")
        }

        const hashedPassword = await hash(password, 5);

        await knex("users").insert({
            name,
            email,
            password: hashedPassword
        })

        return response.status(201).json({ name, email, hashedPassword });
    }

    async update(request, response) {
        const { name, email, password, old_password } = request.body;
        const { id } = request.params;

        const user = await knex("users").where({ id });
        console.log(user)

        if (!user) {
            throw new AppError("Usuário não encontrado.");
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if (password && !old_password) {
            throw new AppError("Informe a senha antiga para salvar a nova senha.");
        };

        if (password && old_password) {
            console.log(old_password, user.password)
            const checkOldPassword = await compare(old_password, user[0].password);

            if (checkOldPassword === false) {
                throw new AppError("A senha antiga não confere.");
            }

            user.password = await hash(password, 5);
        };

        await knex("users").update({
            name: user.name,
            email: user.email,
            password: user.password,
            updated_at: knex.fn.now(),
        }).where({ id: id });

        return response.status(200).json()
    }
}

module.exports = UsersController;