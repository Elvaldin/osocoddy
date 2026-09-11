FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY Backend/OsoCoddy.api/OsoCoddy.api.csproj Backend/OsoCoddy.api/
RUN dotnet restore Backend/OsoCoddy.api/OsoCoddy.api.csproj

COPY Backend/OsoCoddy.api/ Backend/OsoCoddy.api/
RUN dotnet publish Backend/OsoCoddy.api/OsoCoddy.api.csproj \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

COPY --from=build /app/publish ./

ENTRYPOINT ["dotnet", "OsoCoddy.api.dll"]
