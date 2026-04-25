# Import the server
from cloudlink import server

# Import protocols
from cloudlink.server.protocols import clpv4, scratch

# Instantiate the server object
server = server()

# Set logging level
server.logging.basicConfig(
    level=server.logging.INFO # See python's logging library for details on logging levels.
)

# Load protocols
clpv4 = clpv4(server)
scratch = scratch(server)
clpv4.enable_motd(True)
clpv4.motd_message("Welcome to my not secure server!")

# Start the server!
server.run(ip="127.0.0.1", port=3000)

while True:
  commands = [
    "kick",
    "clients",
    "sendToClient",
  ]
  aaaaa = input("COMMAND >>")
  if aaaaa not in commands:
    clpv4.gmsg(aaaaa)

# This is a template I used and you can use too! - bigscaryeaster
# This is also running forever!
