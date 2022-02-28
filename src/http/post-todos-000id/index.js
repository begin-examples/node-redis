const { http } = require('@architect/functions')
const { nanoid } = require('nanoid')
const createConnectedClient = require('@architect/shared/redis-client')

exports.handler = http.async(update)

async function update(req) {
  const client = await createConnectedClient()

  let todo = http.helpers.bodyParser(req)
  todo.completed = !!todo.completed

  await client.hSet('todos', todo.key, JSON.stringify(todo))

  await client.quit()

  return {
    statusCode: 302,
    headers: {
      location: '/',
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
    }
  }
}
