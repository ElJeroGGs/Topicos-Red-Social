import os

def count_lines_in_csv_folder(folder_path):
    total_lines = 0
    # Itera sobre todos los archivos en la carpeta
    for filename in os.listdir(folder_path):
        if filename.lower().endswith('.csv'):
            file_path = os.path.join(folder_path, filename)
            # Abrir en modo binario para contar saltos de línea rápidamente
            with open(file_path, 'rb') as f:
                # Cada '\n' en binario corresponde a un salto de línea
                line_count = f.read().count(b'\n')
                print(f"Contando líneas en {filename}: {line_count}")
                total_lines += line_count
    return total_lines

if __name__ == "__main__":
    folder = "Output"
    folder = os.path.join(os.getcwd(), folder)  # Asegura que la ruta sea absoluta
    total = count_lines_in_csv_folder(folder)
    print(f"Total de líneas en todos los CSV: {total}")