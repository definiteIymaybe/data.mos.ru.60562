const { writeFile } = require('fs').promises
const truncate = require('@turf/truncate').default
const axios = require('axios')
const { parseAsync } = require('json2csv')
const { Timer } = require('./util')
const dotenv = require('dotenv')
dotenv.config()

const baseUrl = `https://apidata.mos.ru/v1/datasets/60562`
const apiKeyParam = `api_key=${process.env.MOSRUKEY}`
const args = process.argv.slice(2)
let skip = parseInt(args[0]) || 0
const rowCount = parseInt(args[1]) || 0
const rowsPerRequest = 10000
const maxRequestsPerRun = 10

const go = async () => {
  if (skip === rowCount) return
  let requestIndex = 1
  const t = new Timer(rowCount, rowsPerRequest)

  for (; skip < rowCount; skip += rowsPerRequest) {
    t.beforeRequest(skip)

    const chunk = await axios
      .get(
        `${baseUrl}/rows?${apiKeyParam}&$top=${rowsPerRequest}&$skip=${skip}`
      )
      .then(({ data }) =>
        data.map(({ Cells }) => {
          const o = Cells
          if (o.geoData) o.geoData = truncate(o.geoData, { precision: 7 })
          return o
        })
      )
      .catch((err) => {
        console.error(err)
        return
      })

    if (!chunk) continue

    const fileName = (skip + rowsPerRequest) / rowsPerRequest

    await Promise.all([
      parseAsync(chunk)
        .then((csv) => {
          writeFile(`data/parts/${fileName}.csv`, csv)
        })
        .catch((err) => {
          console.error(err)
        }),
    ])

    t.uponRequest()
    if (maxRequestsPerRun && requestIndex === maxRequestsPerRun) break
    requestIndex++
  }
}

go()
