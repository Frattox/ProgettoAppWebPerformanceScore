# Progetto Tirocinio
Presento il mio Progetto Formativo creato durante il mio percorso di Tirocinio Curriculare.  
Lo scopo del progetto è fornire una web-app inseribile nel caso d'uso di un'azienda che cerca di prevedere il valore di produttività (___Performance Score___) del proprio lavoratore in base a dei parametri, relativi sia alla persona in sè che ai servizi e oppurtunità offerte dall'azienda.
Il progetto è composto da tre parti principali:
- __Jupyter Notebook__: dove è presente il codice _Python_ per addestrare vari modelli di classificazione, offerti dalla libreria Scikit-Learn, applicato al *[Dataset](https://www.kaggle.com/datasets/mexwell/employee-performance-and-productivity-data)* presente su Kaggle
- __Back-end__: codice _Python_ che usufruisce del micro web framework _Flask_, che permette di ottenere i parametri inseriti dal _front-end_
- __Front-end__: utilizzando il framework _Angular_, si ottiene una interfaccia web nel quale inserire i valori utili alla previsione del performance score e restituire quest'ultimo.

E' possibile utilizzare Docker Container per eseguire il progetto nel suo insieme, evitando problemi di dipendenze e versioni.
Ecco come fare:
- Installare *[Docker Desktop](https://www.docker.com/products/docker-desktop/)*
- Entrare nel path del backend e containerizzarlo attraverso il comando `docker build -t <nome-container-be> .`
- Entrare nel path del frontend e containerizzarlo attraverso il comando `docker build -t <nome-container-fe> .`
- Entrare nel path root e generare il __Docker Compose__ composto dai due nuovi container appena creati, attraverso il comando `docker-compose build`
- Eseguire il docker compose attraverso il comando `docker-compose up`

A questo punto, si può effettuare accedere sul proprio browser al `localhost:4300` per poter interagire con il sistema.
