#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import argparse
import re

def main(img_dir: str) -> None:
    """
    Remove "_XXXX" (where X is any digit) from the image file names.
    
    This is necessary because of the file names resulting from 
    using Photoshop to export layers as files.
    """
    for file_name in os.listdir(img_dir):
        if not file_name.endswith(".jpg"):
            continue
        new_file_name = re.sub("_\d\d\d\d_", "_", file_name)
        file_path = os.path.join(img_dir, file_name)
        new_file_path = os.path.join(img_dir, new_file_name)
        os.rename(file_path, new_file_path)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Pre-process images for the trajectory comparison matrix"
    )
    parser.add_argument(
        "dir", help="path to directory of cropped named screenshots"
    )
    args = parser.parse_args()
    main(args.dir)
