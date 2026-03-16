import csv

def write_csv(path, data, fieldnames):

    with open(path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()

        for row in data:
            writer.writerow(row)