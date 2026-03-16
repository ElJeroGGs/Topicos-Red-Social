from faker.providers import BaseProvider

class CityProvider(BaseProvider):

    mexico_cities = [
        {"city":"Aguascalientes","state":"Aguascalientes","country":"Mexico"},
        {"city":"Mexicali","state":"Baja California","country":"Mexico"},
        {"city":"La Paz","state":"Baja California Sur","country":"Mexico"},
        {"city":"San Francisco de Campeche","state":"Campeche","country":"Mexico"},
        {"city":"Tuxtla Gutiérrez","state":"Chiapas","country":"Mexico"},
        {"city":"Chihuahua","state":"Chihuahua","country":"Mexico"},
        {"city":"Ciudad de México","state":"Ciudad de México","country":"Mexico"},
        {"city":"Saltillo","state":"Coahuila","country":"Mexico"},
        {"city":"Colima","state":"Colima","country":"Mexico"},
        {"city":"Durango","state":"Durango","country":"Mexico"},
        {"city":"Guanajuato","state":"Guanajuato","country":"Mexico"},
        {"city":"Chilpancingo","state":"Guerrero","country":"Mexico"},
        {"city":"Pachuca","state":"Hidalgo","country":"Mexico"},
        {"city":"Guadalajara","state":"Jalisco","country":"Mexico"},
        {"city":"Toluca","state":"Estado de México","country":"Mexico"},
        {"city":"Morelia","state":"Michoacán","country":"Mexico"},
        {"city":"Cuernavaca","state":"Morelos","country":"Mexico"},
        {"city":"Tepic","state":"Nayarit","country":"Mexico"},
        {"city":"Monterrey","state":"Nuevo León","country":"Mexico"},
        {"city":"Oaxaca","state":"Oaxaca","country":"Mexico"},
        {"city":"Puebla","state":"Puebla","country":"Mexico"},
        {"city":"Santiago de Querétaro","state":"Querétaro","country":"Mexico"},
        {"city":"Chetumal","state":"Quintana Roo","country":"Mexico"},
        {"city":"San Luis Potosí","state":"San Luis Potosí","country":"Mexico"},
        {"city":"Culiacán","state":"Sinaloa","country":"Mexico"},
        {"city":"Hermosillo","state":"Sonora","country":"Mexico"},
        {"city":"Villahermosa","state":"Tabasco","country":"Mexico"},
        {"city":"Ciudad Victoria","state":"Tamaulipas","country":"Mexico"},
        {"city":"Tlaxcala","state":"Tlaxcala","country":"Mexico"},
        {"city":"Xalapa","state":"Veracruz","country":"Mexico"},
        {"city":"Mérida","state":"Yucatán","country":"Mexico"},
        {"city":"Zacatecas","state":"Zacatecas","country":"Mexico"}
    ]

    us_cities = [
        {"city":"Birmingham","state":"Alabama","country":"United States"},
        {"city":"Anchorage","state":"Alaska","country":"United States"},
        {"city":"Phoenix","state":"Arizona","country":"United States"},
        {"city":"Little Rock","state":"Arkansas","country":"United States"},
        {"city":"Los Angeles","state":"California","country":"United States"},
        {"city":"Denver","state":"Colorado","country":"United States"},
        {"city":"Bridgeport","state":"Connecticut","country":"United States"},
        {"city":"Wilmington","state":"Delaware","country":"United States"},
        {"city":"Miami","state":"Florida","country":"United States"},
        {"city":"Atlanta","state":"Georgia","country":"United States"},
        {"city":"Honolulu","state":"Hawaii","country":"United States"},
        {"city":"Boise","state":"Idaho","country":"United States"},
        {"city":"Chicago","state":"Illinois","country":"United States"},
        {"city":"Indianapolis","state":"Indiana","country":"United States"},
        {"city":"Des Moines","state":"Iowa","country":"United States"},
        {"city":"Wichita","state":"Kansas","country":"United States"},
        {"city":"Louisville","state":"Kentucky","country":"United States"},
        {"city":"New Orleans","state":"Louisiana","country":"United States"},
        {"city":"Portland","state":"Maine","country":"United States"},
        {"city":"Baltimore","state":"Maryland","country":"United States"},
        {"city":"Boston","state":"Massachusetts","country":"United States"},
        {"city":"Detroit","state":"Michigan","country":"United States"},
        {"city":"Minneapolis","state":"Minnesota","country":"United States"},
        {"city":"Jackson","state":"Mississippi","country":"United States"},
        {"city":"Kansas City","state":"Missouri","country":"United States"},
        {"city":"Billings","state":"Montana","country":"United States"},
        {"city":"Omaha","state":"Nebraska","country":"United States"},
        {"city":"Las Vegas","state":"Nevada","country":"United States"},
        {"city":"Manchester","state":"New Hampshire","country":"United States"},
        {"city":"Newark","state":"New Jersey","country":"United States"},
        {"city":"Albuquerque","state":"New Mexico","country":"United States"},
        {"city":"New York","state":"New York","country":"United States"},
        {"city":"Charlotte","state":"North Carolina","country":"United States"},
        {"city":"Fargo","state":"North Dakota","country":"United States"},
        {"city":"Columbus","state":"Ohio","country":"United States"},
        {"city":"Oklahoma City","state":"Oklahoma","country":"United States"},
        {"city":"Portland","state":"Oregon","country":"United States"},
        {"city":"Philadelphia","state":"Pennsylvania","country":"United States"},
        {"city":"Providence","state":"Rhode Island","country":"United States"},
        {"city":"Columbia","state":"South Carolina","country":"United States"},
        {"city":"Sioux Falls","state":"South Dakota","country":"United States"},
        {"city":"Nashville","state":"Tennessee","country":"United States"},
        {"city":"Houston","state":"Texas","country":"United States"},
        {"city":"Salt Lake City","state":"Utah","country":"United States"},
        {"city":"Burlington","state":"Vermont","country":"United States"},
        {"city":"Virginia Beach","state":"Virginia","country":"United States"},
        {"city":"Seattle","state":"Washington","country":"United States"},
        {"city":"Charleston","state":"West Virginia","country":"United States"},
        {"city":"Milwaukee","state":"Wisconsin","country":"United States"},
        {"city":"Cheyenne","state":"Wyoming","country":"United States"}
    ]

    raw_cities = mexico_cities + us_cities

    cities = [
        {
            "internal_id:(Ciudad)": i,
            "nombre": city["city"],
            "estado": city["state"],
            "pais": city["country"]
        }
        for i, city in enumerate(raw_cities, start=1)
    ]
    
    def city_node(self):
        """Devuelve un nodo de ciudad."""
        return self.random_element(self.cities)

    def city_id(self):
        """Devuelve solo el ID de ciudad para relaciones."""
        city = self.random_element(self.cities)
        return city["internal_id:(Ciudad)"]
    
    def all_cities(self):
        return self.cities
    
    def city_count(self):
        """Devuelve el número total de ciudades disponibles."""
        return len(self.cities)
