```mermaid
sequenceDiagram
    participant browser
    participant server
    Note right of browser: Käyttäjä avaa selaimessa sivun https://studies.cs.helsinki.fi/exampleapp/spa

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    activate server
    server-->>browser: status 200 HTML-tiedosto
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: status 200 css-tiedosto
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    activate server
    server-->>browser: Status 200 JavaScript-tiedosto
    deactivate server
    
    Note right of browser: Selain suorittaa JavaScript-koodin, joka noutaa datan palvelimelta
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: status 200 json-data 
    deactivate server    

    Note right of browser: Selain suorittaa callback-funktion, joka renderöi muistiinpanot
```
