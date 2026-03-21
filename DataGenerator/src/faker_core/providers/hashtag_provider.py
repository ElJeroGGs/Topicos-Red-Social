from faker.providers import BaseProvider

class HashtagProvider(BaseProvider):
    def hashtag_name(self):
        hashtags = ['tech', 'dev', 'lifestyle', 'fitness', 'travel', 'coding',
                    'food', 'fashion', 'art', 'music', 'photography', 'nature',
                    'design', 'marketing', 'business', 'startup', 'gaming', 'sports',
                    'health', 'education', 'news', 'entertainment', 'science', 'history',
                    'cinema', 'books', 'finance', 'politics', 'environment', 'socialmedia', 'inspiration',]
        return self.random_element(hashtags) + str(self.random_int(1,100))
    
    def hashtag_description(self):
        return self.generator.sentence(nb_words=10)

