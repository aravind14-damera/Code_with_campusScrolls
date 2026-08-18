import cloudinary.uploader


def upload_pdf(file_path: str, folder: str):
    result = cloudinary.uploader.upload(
        file_path,
        resource_type="image",
        folder=folder
    )

    return {
        "public_id": result.get("public_id"),
        "secure_url": result.get("secure_url"),
        "original_filename": result.get("original_filename"),
        "bytes": result.get("bytes"),
        "format": result.get("format"),
    }