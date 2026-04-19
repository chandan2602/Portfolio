# Add this endpoint to your FastAPI router temporarily to make yourself admin

@router.post("/make-admin")
def make_admin(email: str, db: Session = Depends(get_db)):
    """Temporary endpoint to make a user admin - REMOVE IN PRODUCTION!"""
    user = db.query(LoginDetail).filter(LoginDetail.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.role_id = 1
    db.commit()
    
    return {"message": f"{user.name} is now an admin", "role_id": user.role_id}

# Usage: POST to /api/make-admin?email=CHANDANKUNAYAK2003@GMAIL.COM
