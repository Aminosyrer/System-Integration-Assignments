import json
import yaml
import xml.etree.ElementTree
import csv
import os

def parse_text_file(file_path):
    with open(file_path, 'r') as file:
        data = file.read().strip().split('\n\n')
        parsed_data = []
        for person in data:
            details = person.split('\n')
            person_data = {}
            for detail in details:
                key, value = detail.split(': ')
                person_data[key.lower()] = int(value) if key.lower() == 'age' else value
            parsed_data.append(person_data)
    print("Txt data:")
    print(parsed_data)
    print("")

def parse_xml_file(file_path):
    tree = xml.etree.ElementTree.parse(file_path)
    root = tree.getroot()
    data = []
    for person in root.findall('person'):
        person_data = {child.tag: int(child.text) if child.tag == 'age' else child.text for child in person}
        data.append(person_data)
    print("XML data:")
    print(data)
    print("")

def parse_yml_file(file_path):
    with open(file_path, 'r') as file:
        data = yaml.safe_load(file)
        data['person'] = [{k: int(v) if k == 'age' else v for k, v in person.items()} for person in data['person']]
    print("YAML data:")
    print(data)
    print("")

def parse_json_file(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
        data['person'] = [{k: int(v) if k == 'age' else v for k, v in person.items()} for person in data['person']]
    print("JSON data:")
    print(data)
    print("")

def parse_csv_file(file_path):
    with open(file_path, 'r') as file:
        reader = csv.DictReader(file)
        data = [{k: int(v) if k == 'age' else v for k, v in row.items()} for row in reader]
    print("CSV data:")
    print(data)
    print("")

supported_files = {
    '.txt': parse_text_file,
    '.xml': parse_xml_file,
    '.yaml': parse_yml_file,
    '.yml': parse_yml_file,
    '.json': parse_json_file,
    '.csv': parse_csv_file
}

def parse_file(file_path):
    _, file_type = os.path.splitext(file_path)
    if file_type in supported_files:
        supported_files[file_type](file_path)
    else:
        return None

def parse_all_files_in_folder(folder_path):
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        if os.path.isfile(file_path):
            parse_file(file_path)

data_folder_path = '../Data'
parse_all_files_in_folder(data_folder_path)