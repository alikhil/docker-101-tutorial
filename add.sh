curl -XPOST http://localhost:1337/todos \
    -d '{"text": "prepare presentation", "complete": true }' \
    -H "Content-Type: application/json"