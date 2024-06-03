using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using YamlDotNet.Serialization;
using System.Xml.Linq;
using CsvHelper;
using System.Globalization;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace ServerB.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DataController : ControllerBase
    {
        private readonly string dataFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "Data");

        [HttpGet("text")]
        public IActionResult GetText()
        {
            var filePath = Path.Combine(dataFolderPath, "data.txt");
            var data = System.IO.File.ReadAllText(filePath).Trim().Split("\n\n");
            var parsedData = data.Select(person =>
            {
                var details = person.Split('\n');
                var personData = new Dictionary<string, object>();
                foreach (var detail in details)
                {
                    var parts = detail.Split(": ");
                    personData[parts[0].ToLower()] = parts[0].ToLower() == "age" ? int.Parse(parts[1]) : parts[1];
                }
                return personData;
            }).ToList();

            return Ok(parsedData);
        }

        [HttpGet("xml")]
        public IActionResult GetXml()
        {
            var filePath = Path.Combine(dataFolderPath, "data.xml");
            var doc = XDocument.Load(filePath);
            var parsedData = doc.Descendants("person").Select(person =>
            {
                var personData = new Dictionary<string, object>();
                foreach (var element in person.Elements())
                {
                    personData[element.Name.LocalName.ToLower()] = element.Name.LocalName.ToLower() == "age" ? int.Parse(element.Value) : element.Value;
                }
                return personData;
            }).ToList();

            return Ok(parsedData);
        }

        [HttpGet("yaml")]
        public IActionResult GetYaml()
        {
            var filePath = Path.Combine(dataFolderPath, "data.yml");
            var deserializer = new DeserializerBuilder().Build();
            var data = deserializer.Deserialize<Dictionary<string, List<Dictionary<string, object>>>>(System.IO.File.ReadAllText(filePath));
            foreach (var person in data["person"])
            {
                person["age"] = int.Parse(person["age"].ToString());
            }

            return Ok(data);
        }

        [HttpGet("json")]
        public IActionResult GetJson()
        {
            var filePath = Path.Combine(dataFolderPath, "data.json");
            var data = JsonSerializer.Deserialize<Dictionary<string, List<Dictionary<string, object>>>>(System.IO.File.ReadAllText(filePath));
            foreach (var person in data["person"])
            {
                person["age"] = int.Parse(person["age"].ToString());
            }

            return Ok(data);
        }

        [HttpGet("csv")]
        public IActionResult GetCsv()
        {
            var filePath = Path.Combine(dataFolderPath, "data.csv");
            using var reader = new StreamReader(filePath);
            using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
            var records = csv.GetRecords<dynamic>().ToList();

            var parsedData = records.Select(record =>
            {
                var personData = new Dictionary<string, object>();
                foreach (var property in record)
                {
                    personData[property.Key.ToLower()] = property.Key.ToLower() == "age" ? int.Parse(property.Value) : property.Value;
                }
                return personData;
            }).ToList();

            return Ok(parsedData);
        }

        [HttpGet("from-server-a/{type}")]
        public async Task<IActionResult> GetFromServerA(string type)
        {
            using var client = new HttpClient();
            var response = await client.GetStringAsync($"http://localhost:3000/{type}");
            return Content(response, "application/json");
        }
    }
}