from faker.providers import BaseProvider

class CommentsProvider(BaseProvider):

    comment_statuses = ['publico', 'spam', 'borrado', 'fijado', 'editado']

    def text_comment(self):
        return self.generator.text(max_nb_chars=200).replace("\n", " ")
    
    def timestamp_comment(self):
        return self.generator.date_time_this_decade().isoformat()
    
    def status_comment(self):
        return self.generator.random_element(self.comment_statuses)
    
    def comment(self, id=None):
        gen = self.generator
        return {
            "internal_id:(Comentario)": id,
            "contenido": gen.text(max_nb_chars=200).replace("\n", " "),
            "fecha_comentario": gen.date_time_this_decade().isoformat(),
            "status": gen.random_element(self.comment_statuses)
        }
