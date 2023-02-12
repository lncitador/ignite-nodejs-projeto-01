import fs from 'node:fs/promises'

const databasePath = (path) => new URL(path, import.meta.url)

class Database {
    #database = {}
    #path = null

    #hasBootstrap = false

    constructor({ path }) {
        if (!path) throw new Error('Path is required')

        if (!path.endsWith('.json')) throw new Error('Path must be a JSON file')

        this.#path = databasePath(path)

        this.#bootstrap()
    }

    #bootstrap() {
        fs.readFile(this.#path, 'utf8')
            .then(data => {
                this.#database = JSON.parse(data)
                this.#hasBootstrap = true
            })
            .catch(() => {
                this.#persist()
                this.#hasBootstrap = true
            })
    }

    async #persist() {
        await fs.writeFile(this.#path, JSON.stringify(this.#database))
    }


    async select(table, search) {
        if (!this.#hasBootstrap) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(this.select(table, search))
                }, 100)
            })
        }

        let data = this.#database[table] || []

        if (search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    if (!value) return true

                    return row[key].includes(value)
                })
            })
        }

        return data
    }

    async insert(table, data) {
        if (!this.#hasBootstrap) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(this.insert(table, data))
                }, 100)
            })
        }

        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        await this.#persist()

        return data
    }

    async update(table, id, data) {
        if (!this.#hasBootstrap) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(this.update(table, id, data))
                }, 100)
            })
        }

        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            console
            this.#database[table][rowIndex] = {
                ...this.#database[table][rowIndex],
                ...data,
            }

            await this.#persist()

            return this.#database[table][rowIndex]
        } else {
            throw new Error('Not found')
        }
    }

    async delete(table, id) {
        if (!this.#hasBootstrap) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(this.delete(table, id))
                }, 100)
            })
        }

        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            await this.#persist()
        }
    }

}


export const createDatabase = (path) => new Database({ path })

const database = new Database({ path: './database.json' })

export default database