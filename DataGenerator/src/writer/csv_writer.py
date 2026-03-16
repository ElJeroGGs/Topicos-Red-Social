import csv

def write_csv(path, data, fieldnames, batch_size=10_000):
    with open(path, "w", newline="", encoding="utf-8", buffering=1024*1024) as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()

        batch = []

        for row in data:
            batch.append(row)

            if len(batch) == batch_size:
                writer.writerows(batch)
                batch.clear()

        if batch:
            writer.writerows(batch)