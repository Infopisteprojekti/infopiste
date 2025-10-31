```mermaid
 architecture-beta
    group microsoft(cloud)[Microsoft]

    service db(database)[MongoDB]
    service redis(database)[Redis]
    service server(server)[Express]
    service react(internet)[React]

    service ms(internet)[GraphAPI] in microsoft
    service calendar(internet)[Outlook Calendar] in microsoft
    service forms(internet)[Forms] in microsoft

    db:L -- R:server
    server:B -- T:redis
    server:L -- R:react
    server:T -- B:ms
    forms:R -- L:ms
    calendar:L -- R:ms
```
