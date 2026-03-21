import random

TOTAL_HASHTAGS = 500
TOTAL_CATEGORIAS = 100

def generar_hashtag_categoria():
    for hashtag in range(1, TOTAL_HASHTAGS + 1):
        categoria = random.randint(1, TOTAL_CATEGORIAS)
        yield {
            ":START_ID(Hashtag)": hashtag,
            ":END_ID(Categoria)": categoria
        }

def generar_subcategoria():
    for categoria in range(1, TOTAL_CATEGORIAS + 1):
        # 30% de categorías tienen subcategoría
        if random.random() < 0.3:
            # elegir padre diferente al mismo
            padre = random.randint(1, TOTAL_CATEGORIAS)
            while padre == categoria:
                padre = random.randint(1, TOTAL_CATEGORIAS)

            yield {
                ":START_ID(Categoria)": categoria,
                ":END_ID(Categoria)": padre
            }