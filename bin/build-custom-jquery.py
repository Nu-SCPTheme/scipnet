#!/usr/bin/python3

# build-custom-jquery.py
#
# scipnet - Frontend scripts for mekhane
# Copyright (C) 2019 not_a_seagull
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
# 
# You should have received a copy of the GNU Affero General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.

# The purpose of this file is to build a slimmer version of jquery to include in the project

import os
import shutil
import subprocess
import sys

def log(msg):
  print("[build-custom-jquery] {}".format(msg))

# pull Jquery from the repo
log("Cloning jquery repository from GitHub...")
return_code = subprocess.call(["git", "clone", "git://github.com/jquery/jquery.git"])

os.chdir("jquery")

# download dev dependencies, then run grunt to build jquery
log("Downloading jquery dev dependencies...")
return_code = subprocess.call(["npm", "i"])
log("Invoking grunt to build jquery...")

excluded_modules = [
  "css/showHide",
  "dimensions",
  "effects",
  "offset",
  "exports/global",
  "exports/amd"
]

module_exclusion_arg = "custom:-{}".format(",-".join(excluded_modules))
grunt = subprocess.Popen(["npx", "grunt", module_exclusion_arg], stdin=subprocess.PIPE, stdout=subprocess.PIPE);
grunt.stdin.write(b"n\n"); # say no to anonymous problem reporting
print(grunt.communicate()[0].decode("utf-8"))
return_code = grunt.wait()

if return_code != 0:
  sys.exit(1)

# copy jquery to a library directory
log("Copying jquery to lib directory")
os.chdir("..") 

lib = "lib"

if not os.path.exists(lib):
  os.makedirs(lib)

shutil.copyfile("jquery/dist/jquery.min.js", "lib/jquery.js")
#shutil.copyfile("node_modules/@types/jquery/JQuery.d.ts", "lib/jquery.d.ts")

# delete the jquery folder to save space
log("Deleting jquery to save space")
shutil.rmtree("jquery")

# replace "jquery" in dist/sources files with "./../../{../}lib/jquery"
log("Replacing \"jquery\" string in files with path to new library")
def replacement(dirname, depth=1):
  newPath = "\"./../"
  for _ in range(depth):
    newPath += "../"
  newPath += "lib/jquery\""

  for stat in os.listdir(dirname):
    filename = os.path.join(dirname, stat)
    log("Running replacement on {}".format(filename))
    if os.path.isdir(filename):
      replacement(filename, depth + 1)
    else:
      txt = ""
      with open(filename, "r") as f:
        txt = f.read()
        txt = txt.replace("\"jquery\"", newPath)
      with open(filename, "w") as f:
        f.write(txt)
replacement("dist/sources")
