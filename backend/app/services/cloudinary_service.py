import cloudinary.uploader


def upload_pdf(file, folder: str):

    result = cloudinary.uploader.upload(
        file,
        resource_type="raw",
        folder=folder,
        use_filename=True,
        unique_filename=True
    )

    return {
        "public_id": result.get("public_id"),
        "secure_url": result.get("secure_url"),
        "original_filename": result.get("original_filename"),
        "bytes": result.get("bytes"),
        "format": result.get("format"),
    }