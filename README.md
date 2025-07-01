Steps of frontend Installation :

cd frontend
npm install 
npm run dev 

Steps of backend Installation :

cd backend
python -m venv venv
pip install -r requirements.txt
venv/Scripts/activate
uvicorn main:app --reload

add .env file in backend folder and add DATABASE_URL like this
DATABASE_URL=postgresql://postgres:<Password>@localhost:5432/edudiagno_interns

and create the table with name "offer_letters"

Password should be of Postgresql 

Steps to Generate Internship Offer Letter:
Select a Candidate
Enter a Candidate
Enter Duration , Start Date , End Date of Internship and then click Save Offer Letter Data and then click Generate Offer Letter
Then project will generate the offer letter in backend using the template its been provided in backend . 