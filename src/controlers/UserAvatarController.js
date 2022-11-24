const knex = require('../database/knex');
const AppError = require('../utils/AppError');
const DiskStorage = require('../providers/diskStorage');

class UserAvatarController {
    async update(request, response) {
        const user_id = request.user.id;
        const avatarFilename = request.file.filename;

        const user = await knex("users").where({ id: user_id }).first();

        const diskStorage = new DiskStorage();

        if(!user){
            throw new AppError('É necessário fazer login para alterar a foto.')
        }

        if(user.avatar) {
            await diskStorage.delete(user.avatar);
        }

        await diskStorage.save(avatarFilename);
        user.avatar = avatarFilename;

        await knex("users").update(user).where({ id: user_id });

        return response.json(user);
    }
}

module.exports = UserAvatarController;