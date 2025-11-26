const db = {
    users: [
        {
            id: 0,
            role: "admin",
            username: "virgil",
            password: "password",
        },
        {
            id: 1,
            role: "student",
            username: "a",
            password: "a",
        }
    ],
    students: [
        {
            id: 1,
            firstName: 'John',
            lastName: 'Appleseed',
            age: 21,
        },
        {
            id: 2,
            firstName: 'Mary',
            lastName: 'The lamb',
            age: 21,
        },
    ],
}

const findEntity = (entity, id) => {
    return new Promise((resolve, reject) => {
        console.log('promise executed');

        const result = db[entity].find(entity => entity.id === id);

        if(!result) {
            reject("No results");
        }
        
        resolve(result);
    });
}

const findUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        const result = db.users.find(user => user.username === username);

        if (!result) {
            reject("User not found");
        }

        resolve(result);
    });
}

const createEntity = (entity, data) => {
    return new Promise((resolve, reject) => {
        try {
            data.id = db[entity].length + 1;
            db[entity].push({...data});
            console.log('db: createEntity', db);
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

const updateEntity = (entity, id, data) => {
    return new Promise((resolve, reject) => {
        const entityIndex = db[entity].findIndex(entity => entity.id === id);
        console.log('db: updateEntity: found Index', entityIndex);

        if (entityIndex === -1) {
            reject("Entity not found");
        }

        db[entity][entityIndex] = { ...db[entity][entityIndex], ...data };
        console.log('db: updateEntity', db);
        resolve(db[entity][entityIndex]);
    });
};

const deleteEntity = (entity, id) => {
    return new Promise((resolve, reject) => {
        try {
            const initialLength = db[entity].length;
            db[entity] = db[entity].filter(entity => entity.id !== id);
            console.log('db: deleteEntity', db);

            if (db[entity].length === initialLength) {
                reject("Entity not found");
            }

            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
};

const listEntities = (entity) => {
    return new Promise((resolve, reject) => {
        try {
            console.log('db: listEntities', db);
            resolve(db[entity]);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { db, findEntity, findUserByUsername, updateEntity, createEntity, deleteEntity, listEntities };