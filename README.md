Next JS App using Open Weather API to fetch weather information

App URL - https://weather-app-nextjs-frontend-eqpsixwtl-subramanian-n-gs-projects.vercel.app

APIs used  

1. to fetch weather information - https://api.openweathermap.org/data/2.5/weather?q={city name},{country code}&appid={API key}
2. to fetch countries list - https://restcountries.com/v2/all?fields=name,alpha2Code

Functionalities

1. Get weather information by entering city name and selecting country(optional)
2. Users can access the website with and without login.
3. Loggedin users will have option to bookmark cities. View bookmarked cities will list the saved cities with their weather information.
4. Backend APIs to persist user data(bookmarks and user login information) are implemented with Express server and MongoDB database.


