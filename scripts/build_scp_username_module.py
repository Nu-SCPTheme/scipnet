#!/usr/bin/python3

# build_scp_username_module.py
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
  print("[build-scp-username-module] {}".format(msg))

if os.path.isdir("node_modules/scp-username-module") and not "rebuild" in sys.argv:
  log("node_modules/scp-username-module already exists. If you would like to rebuild this package, run this file with \"rebuild\" as an argument.")
  sys.exit(0)

# clone the repo from github
log("Cloning scp_username_module from GitHub...");
return_code = subprocess.call(["git", "clone", "https://github.com/Nu-SCPTheme/scp-username-module.git"])

os.chdir("scp-username-module")

# make sure we have wasm-pack installed
log("Calling wasm-pack to ensure it is installed...");
try:
  with open(os.devnull, "w") as devnull:
    subprocess.call(["wasm-pack"], stdout=devnull, stderr=devnull)
except:
  log("Installing wasm-pack via cargo...")
  return_code = subprocess.call(["cargo", "install", "wasm-pack"])
  if return_code != 0:
    sys.exit(1)

log("Building scp_username_module using wasm-pack...")
return_code = subprocess.call(["wasm-pack", "build"])
if return_code != 0:
  sys.exit(1)

log("Copying new package to node_modules...")
os.chdir("..")
if os.path.exists("node_modules/scp-username-module"):
  log("Removing node_modules/scp-username-module")
  shutil.rmtree("node_modules/scp-username-module")

shutil.copytree("scp-username-module/pkg", "node_modules/scp-username-module")

log("Deleting scp-username-module folder to save space")
shutil.rmtree("scp-username-module")
