from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

app = FastAPI()

app.mount('/static', StaticFiles(directory='static'), name='static')


class ContactForm(BaseModel):
    name: str = Field(..., example='Иван Иванов')
    phone: str = Field(..., example='+7 (123) 456-78-90')
    comment: str | None = Field(None, example='Нужно поставить памятник в середине июня.')


@app.get('/', response_class=FileResponse)
async def read_index():
    return FileResponse('static/index.html')


@app.post('/api/contact')
async def receive_contact(form_data: ContactForm):
    return {'message': 'Данные получены успешно', 'data': form_data}
